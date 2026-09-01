import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amountPaise } = await req.json();

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `human_order_${Date.now()}`
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
