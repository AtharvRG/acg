"use client";

import Link from "next/link";
import {
  Server, Cpu, Activity,
  Settings, Bell, Search,
  ArrowUpRight, ArrowDownRight, MapPin, MoreHorizontal
} from "lucide-react";

export default function ComputePortal() {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-300 font-sans flex selection:bg-orange-500/30">

      {/* Sidebar - Ultra Flat */}
      <aside className="w-[240px] bg-[#121214] flex flex-col border-r border-[#1C1C1F]">
        <div className="p-6 flex items-center gap-3">
          <div className="w-7 h-7 bg-[#FF5C00] rounded-md flex items-center justify-center">
            <Server className="w-4 h-4 text-black" />
          </div>
          <span className="text-white font-bold tracking-wide text-sm">CloudSaaS</span>
        </div>

        <div className="px-4 py-2 flex-1 space-y-1">
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#18181A] border-none rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#FF5C00] transition-all"
            />
          </div>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#FF5C00]/10 text-[#FF5C00] rounded-full text-xs font-medium">
            <Activity className="w-4 h-4" /> Overview
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-300 rounded-full text-xs font-medium transition-colors">
            <Cpu className="w-4 h-4" /> Compute Nodes
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-300 rounded-full text-xs font-medium transition-colors">
            <Server className="w-4 h-4" /> Infrastructure
          </button>
        </div>

        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-xs font-medium">
            Exit Portal
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header - No blur, pure flat */}
        <header className="h-20 px-8 flex items-center justify-between bg-[#0E0E10]">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Active Infrastructure</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-500">ap-south-1 (Mumbai)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#121214] p-1.5 rounded-full border border-[#1C1C1F]">
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-[#1C1C1F]">Dashboard</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300">Catalog</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300">Billing</button>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-white"><Bell className="w-4 h-4" /></button>
            <button className="text-zinc-500 hover:text-white"><Settings className="w-4 h-4" /></button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white font-bold border border-zinc-700">
              AG
            </div>
          </div>
        </header>

        {/* Dashboard Grid - Mimicking the flat TransGlobal style */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* Top KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Compute Hours", value: "789", trend: "+5.45%", isUp: true, icon: Server },
              { label: "Active Nodes", value: "120", trend: "-0.45%", isUp: false, icon: Activity },
              { label: "Provisioned GPUs", value: "98", trend: "+5.45%", isUp: true, icon: Cpu }
            ].map((stat, i) => (
              <div key={i} className="bg-[#121214] rounded-2xl p-5 flex items-center justify-between border border-[#1C1C1F]/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#18181A] flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</h3>
                    <div className="flex items-baseline gap-3">
                      <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
                      <span className={`text-[10px] font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'} flex items-center`}>
                        {stat.trend} {stat.isUp ? <ArrowUpRight className="w-3 h-3 ml-0.5" /> : <ArrowDownRight className="w-3 h-3 ml-0.5" />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-[#121214] rounded-2xl p-5 flex flex-col justify-center items-center border border-[#1C1C1F]/50">
               <span className="text-xs text-zinc-400 mb-3 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse"></span>
                 5 Alerts Pending
               </span>
               <button className="w-full py-2 bg-[#FF5C00] text-black text-xs font-bold rounded-full hover:bg-[#e05100] transition-colors">
                 Provision Compute
               </button>
            </div>
          </div>

          {/* Middle Complex Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Heatmap / Analytics View (Span 2) */}
            <div className="lg:col-span-2 bg-[#121214] rounded-3xl p-6 border border-[#1C1C1F]/50">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">Compute Utilization</h3>
                  <div className="flex gap-12">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Peak Latency</p>
                      <p className="text-2xl font-medium text-white flex items-baseline gap-1">97 <ArrowUpRight className="w-3 h-3 text-zinc-500" /></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Avg Nodes</p>
                      <p className="text-2xl font-medium text-white flex items-baseline gap-1">120 <ArrowUpRight className="w-3 h-3 text-zinc-500" /></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Max Capacity</p>
                      <p className="text-2xl font-medium text-white flex items-baseline gap-1">259 <ArrowUpRight className="w-3 h-3 text-zinc-500" /></p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 bg-[#18181A] p-1 rounded-full text-[10px] font-medium text-zinc-500 border border-[#1C1C1F]">
                  <span className="px-3 py-1 hover:text-white cursor-pointer rounded-full">Day</span>
                  <span className="px-3 py-1 bg-[#222224] text-white rounded-full">Week</span>
                  <span className="px-3 py-1 hover:text-white cursor-pointer rounded-full">Month</span>
                </div>
              </div>

              {/* Heatmap Simulation (From reference 1) */}
              <div className="flex gap-2 w-full mt-10">
                <div className="flex flex-col gap-2 justify-between text-[10px] text-zinc-600 font-medium py-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-1.5">
                  {/* Generate a fake grid of heatmap blocks */}
                  {Array.from({ length: 84 }).map((_, i) => {
                    const intensity = Math.random();
                    let bgClass = "bg-[#18181A]"; // Empty
                    if (intensity > 0.8) bgClass = "bg-[#FF5C00]"; // High
                    else if (intensity > 0.6) bgClass = "bg-[#FF5C00]/60"; // Med
                    else if (intensity > 0.4) bgClass = "bg-[#FF5C00]/30"; // Low

                    // Add slight border radius like the reference
                    return <div key={i} className={`w-full aspect-[2/1] rounded-sm ${bgClass}`} />
                  })}
                </div>
              </div>
            </div>

            {/* Catalog Target (The item the AI buys) */}
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
                  <span className="text-[10px] text-zinc-500 font-mono">ID: #10986-779</span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2">Enterprise GPU Node</h4>
                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                  High-performance AI training compute cluster with dynamic auto-scaling and dedicated VRAM allocation.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF5C00]"></div>
                    <div className="flex-1">
                      <p className="text-[10px] text-zinc-500 uppercase">Base Cost</p>
                      <p className="text-sm text-white font-medium">₹500.00 / hr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative before:absolute before:left-1 before:top-[-20px] before:bottom-6 before:w-px before:bg-zinc-800">
                    <div className="w-2 h-2 rounded-full bg-zinc-600 z-10"></div>
                    <div className="flex-1">
                      <p className="text-[10px] text-zinc-500 uppercase">Volume Tier Active</p>
                      <p className="text-sm text-white font-medium">≥ 50 Units (25% Off)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 bg-[#18181A] p-3 rounded-xl border border-[#1C1C1F]">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Server className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs text-white font-medium">Auto-Scale Agent</p>
                  <p className="text-[10px] text-zinc-500">Monitoring threshold</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
