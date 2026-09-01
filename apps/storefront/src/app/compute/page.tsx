"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Server, Cpu, Activity, Settings, Bell, Search,
  ArrowUpRight, ArrowDownRight, MapPin, MoreHorizontal, X, Loader2, Database
} from "lucide-react";

export default function ComputePortal() {
  const router = useRouter();
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Live State synced with the AI
  const [aiProvisioned, setAiProvisioned] = useState(0);
  const [aiPulse, setAiPulse] = useState(false);

  // Deterministic pseudo-random generation to prevent Next.js Hydration Mismatches.
  // It creates a wave-like pattern that simulates realistic server load, but always 
  // generates the exact same sequence on both the Server (SSR) and Client.
  const baseHeatmap = useMemo(() => {
    return Array.from({ length: 83 }).map((_, i) => {
      // Combining sine waves at different frequencies creates a pseudo-random distribution between 0 and 1
      const val = (Math.sin(i * 0.7) + Math.cos(i * 0.4) + Math.sin(i * 1.1)) / 3;
      return (val + 1) / 2; // Normalize to 0 - 1
    });
  }, []);

  // Poll the God-Mode Dashboard API
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:3000/api/sync");
        const data = await res.json();
        
        if (data.logs) {
          // Sum up the exact units passed by the backend webhook
          const totalAiUnits = data.logs
            .filter((l: any) => l.action === "EXECUTE_CHECKOUT" && l.details.includes("Settled"))
            .reduce((acc: number, log: any) => acc + (log.units || 0), 0);
          
          setAiProvisioned((prev) => {
            if (totalAiUnits > prev) {
              setAiPulse(true);
              setTimeout(() => setAiPulse(false), 2000);
              return totalAiUnits;
            }
            return prev;
          });
        }
      } catch (err) {
        // Silently fail if Dashboard is offline
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const basePrice = 500;
  const isDiscounted = qty >= 50;
  const discountRate = isDiscounted ? 0.25 : 0;
  const subtotal = qty * basePrice;
  const discountAmount = subtotal * discountRate;
  const finalPrice = subtotal - discountAmount;

  const handleManualProvision = async () => {
    setIsProcessing(true);
    const res = await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
    
    if (!res) { alert("Razorpay SDK failed to load."); setIsProcessing(false); return; }

    const orderRes = await fetch("/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountPaise: finalPrice * 100 })
    });
    const orderData = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: finalPrice * 100,
      currency: "INR",
      name: "CloudSaaS Infrastructure",
      description: `${qty}x Enterprise GPU Nodes`,
      order_id: orderData.orderId,
      handler: function (response: any) {
        setIsProvisionOpen(false);
        router.push(`/compute/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&qty=${qty}`);
      },
      prefill: { name: "DevOps Engineer", email: "devops@techcorp.com", contact: "9999999999" },
      theme: { color: "#FF5C00" }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-300 font-sans flex selection:bg-orange-500/30">
      
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#121214] flex flex-col border-r border-[#1C1C1F] shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-7 h-7 bg-[#FF5C00] rounded-md flex items-center justify-center">
            <Server className="w-4 h-4 text-black" />
          </div>
          <span className="text-white font-bold tracking-wide text-sm">CloudSaaS</span>
        </div>
        <div className="px-4 py-2 flex-1 space-y-1">
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input type="text" placeholder="Search..." className="w-full bg-[#18181A] border-none rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF5C00] transition-all" />
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#FF5C00]/10 text-[#FF5C00] rounded-full text-xs font-medium"><Activity className="w-4 h-4" /> Overview</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-300 rounded-full text-xs font-medium transition-colors"><Cpu className="w-4 h-4" /> Compute Nodes</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-300 rounded-full text-xs font-medium transition-colors"><Database className="w-4 h-4" /> Storage</button>
        </div>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-xs font-medium">Exit Portal</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <header className="h-20 px-8 flex items-center justify-between bg-[#0E0E10] shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Active Infrastructure</h1>
            <div className="flex items-center gap-2 mt-1"><MapPin className="w-3 h-3 text-zinc-500" /><span className="text-xs text-zinc-500">ap-south-1 (Mumbai)</span></div>
          </div>
          <div className="flex items-center gap-4 bg-[#121214] p-1.5 rounded-full border border-[#1C1C1F]">
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-[#1C1C1F]">Dashboard</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300">Catalog</button>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#121214] rounded-2xl p-5 flex items-center justify-between border border-[#1C1C1F]/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#18181A] flex items-center justify-center"><Server className="w-5 h-5 text-zinc-400" /></div>
                <div>
                  <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Total Compute Hours</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-bold text-white leading-none">{789 + aiProvisioned}</p>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center">+5.45% <ArrowUpRight className="w-3 h-3 ml-0.5" /></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121214] rounded-2xl p-5 flex items-center justify-between border border-[#1C1C1F]/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#18181A] flex items-center justify-center"><Activity className="w-5 h-5 text-zinc-400" /></div>
                <div>
                  <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">Active Nodes</h3>
                  <div className="flex items-baseline gap-3"><p className="text-2xl font-bold text-white leading-none">120</p></div>
                </div>
              </div>
            </div>

            {/* AI LIVE METRIC */}
            <div className="bg-[#121214] rounded-2xl p-5 flex items-center justify-between border border-[#1C1C1F]/50 relative overflow-hidden">
              {aiPulse && <div className="absolute inset-0 bg-[#FF5C00]/20 animate-pulse transition-colors duration-1000" />}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#18181A] flex items-center justify-center"><Cpu className="w-5 h-5 text-zinc-400" /></div>
                <div>
                  <h3 className="text-[11px] font-medium text-[#FF5C00] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full bg-[#FF5C00] ${aiPulse ? 'animate-ping' : ''}`}></div> Provisioned GPUs
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-bold text-white leading-none transition-all">{98 + aiProvisioned}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121214] rounded-2xl p-5 flex flex-col justify-center items-center border border-[#1C1C1F]/50">
               <button onClick={() => setIsProvisionOpen(true)} className="w-full py-2 bg-[#FF5C00] text-black text-xs font-bold rounded-full hover:bg-[#e05100] transition-colors">
                 Provision Compute
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Heatmap */}
            <div className="lg:col-span-2 bg-[#121214] rounded-3xl p-6 border border-[#1C1C1F]/50">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">Compute Utilization</h3>
                  <div className="flex gap-12">
                    <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Peak Latency</p><p className="text-2xl font-medium text-white flex items-baseline gap-1">97 <ArrowUpRight className="w-3 h-3 text-zinc-500" /></p></div>
                    <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Max Capacity</p><p className="text-2xl font-medium text-white flex items-baseline gap-1">259 <ArrowUpRight className="w-3 h-3 text-zinc-500" /></p></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full mt-10">
                <div className="flex flex-col gap-2 justify-between text-[10px] text-zinc-600 font-medium py-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-1.5">
                  {/* Stable Base Heatmap */}
                  {baseHeatmap.map((intensity, i) => {
                    let bgClass = "bg-[#18181A]"; 
                    if (intensity > 0.8) bgClass = "bg-[#FF5C00]"; 
                    else if (intensity > 0.6) bgClass = "bg-[#FF5C00]/60"; 
                    else if (intensity > 0.4) bgClass = "bg-[#FF5C00]/30"; 
                    return <div key={i} className={`w-full aspect-[2/1] rounded-sm ${bgClass}`} />;
                  })}
                  
                  {/* The 84th Block (Live AI Indicator) */}
                  <div 
                    className={`w-full aspect-[2/1] rounded-sm transition-colors duration-500 ${aiProvisioned > 0 ? 'bg-[#FF5C00]' : 'bg-[#18181A]'} ${aiPulse ? 'animate-pulse shadow-[0_0_15px_#FF5C00]' : ''}`} 
                  />
                </div>
              </div>
            </div>

            {/* Catalog Target */}
            <div className="bg-[#121214] rounded-3xl p-6 flex flex-col border border-[#1C1C1F]/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Target Infrastructure</h3>
                <button><MoreHorizontal className="w-4 h-4 text-zinc-600" /></button>
              </div>
              <div className="flex-1 bg-[#18181A] rounded-2xl p-5 border border-[#1C1C1F]">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-2.5 py-1 bg-[#FF5C00]/10 text-[#FF5C00] text-[10px] font-bold uppercase tracking-wider rounded-md">
                    SKU: COMPUTE_01
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Enterprise GPU Node</h4>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF5C00]"></div>
                    <div className="flex-1"><p className="text-[10px] text-zinc-500 uppercase">Base Cost</p><p className="text-sm text-white font-medium">₹500.00 / hr</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provisioning Drawer */}
        <>
          <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${isProvisionOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsProvisionOpen(false)} />
          <div className={`fixed top-0 right-0 h-full w-[450px] bg-[#0E0E10] border-l border-[#1C1C1F] shadow-2xl z-50 flex flex-col transition-transform duration-300 ${isProvisionOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-[#1C1C1F] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Server className="w-5 h-5 text-[#FF5C00]" /> Configure Deployment</h2>
              <button onClick={() => setIsProvisionOpen(false)} className="p-2 hover:bg-[#18181A] rounded-full text-zinc-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Allocation (Hours)</h3>
                <div className="flex items-center gap-4 bg-[#18181A] border border-[#1C1C1F] rounded-xl p-2">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 hover:bg-zinc-800 rounded-lg text-white font-mono">-</button>
                  <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="flex-1 bg-transparent text-center text-white font-mono text-xl focus:outline-none" />
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10 hover:bg-zinc-800 rounded-lg text-white font-mono">+</button>
                </div>
                <div className="mt-3 flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Volume Tier: ≥ 50 (25% off)</span>
                  <button onClick={() => setQty(50)} className="text-[#FF5C00] hover:underline font-medium">Apply Tier</button>
                </div>
              </div>
              <div className="bg-[#121214] border border-[#1C1C1F] rounded-xl p-5 space-y-3">
                <div className="pt-3 flex justify-between items-center">
                  <span className="text-white font-bold">Total Execution Cost</span>
                  <span className="text-2xl font-bold text-[#FF5C00] font-mono">₹{finalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#1C1C1F] bg-[#121214]">
              <button onClick={handleManualProvision} disabled={isProcessing} className="w-full py-4 bg-[#FF5C00] text-black font-bold rounded-xl hover:bg-[#e05100] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Infrastructure"}
              </button>
            </div>
          </div>
        </>
      </main>
    </div>
  );
}
