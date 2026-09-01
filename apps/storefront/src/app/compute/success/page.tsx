import Link from "next/link";
import { Server, ArrowRight, CheckCircle2 } from "lucide-react";

export default async function ComputeSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string; qty?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#0E0E10] text-gray-300 font-sans flex flex-col items-center justify-center selection:bg-orange-500/30">

      <div className="w-full max-w-2xl px-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 relative">
          <Server className="w-10 h-10 text-emerald-500" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-[#0E0E10]">
            <CheckCircle2 className="w-4 h-4 text-black" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center mb-4">
          Resources Provisioned
        </h1>

        <p className="text-zinc-500 text-center mb-12">
          Your infrastructure deployment was successful. {params.qty || 1}x Enterprise GPU Nodes are spinning up and will be attached to your VPC shortly.
        </p>

        <div className="bg-[#121214] border border-[#1C1C1F] p-6 rounded-2xl w-full mb-10 space-y-4 font-mono text-sm">
          <div className="flex justify-between items-center border-b border-[#1C1C1F] pb-4">
            <span className="text-zinc-500 uppercase text-[10px] tracking-widest font-sans font-bold">Transaction Hash</span>
            <span className="text-emerald-500">{params.payment_id || "pay_mock_12345"}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#1C1C1F] pb-4">
            <span className="text-zinc-500 uppercase text-[10px] tracking-widest font-sans font-bold">Execution Reference</span>
            <span className="text-zinc-300">{params.order_id || "order_mock_12345"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 uppercase text-[10px] tracking-widest font-sans font-bold">Provisioned Units</span>
            <span className="text-white font-bold">{params.qty || 1} Nodes</span>
          </div>
        </div>

        <Link
          href="/compute"
          className="flex items-center gap-2 bg-[#1C1C1F] border border-[#2C2C2F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2C2C2F] transition-colors text-sm"
        >
          Return to Console <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
