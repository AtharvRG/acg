import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>
}) {
  const params = await searchParams;

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="mb-8">
        <CheckCircle2 className="w-24 h-24 text-black" strokeWidth={1} />
      </div>

      <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-center uppercase mb-6">
        Order<br />Secured
      </h1>

      <p className="text-gray-500 mb-12 text-center max-w-md">
        Your payment has been successfully processed through Razorpay. Your premium audio equipment is currently being prepared for dispatch.
      </p>

      <div className="bg-[#f2f2f2] border border-gray-200 p-6 rounded-lg w-full max-w-md mb-12">
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
          <span className="text-gray-500 text-sm font-medium">Payment ID</span>
          <span className="font-mono text-sm font-bold">{params.payment_id || "pay_mock_12345"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-medium">Order Reference</span>
          <span className="font-mono text-sm font-bold">{params.order_id || "order_mock_12345"}</span>
        </div>
      </div>

      <Link
        href="/shop"
        className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors"
      >
        Continue Shopping <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
