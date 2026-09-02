"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { X, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!isCartOpen) return null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleManualCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await loadRazorpayScript();

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const amountPaise = cartTotal * 100; // Convert to paise

      // 1. Create order on our backend
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaise })
      });
      if (!orderRes.ok || !orderRes.headers.get("content-type")?.includes("application/json")) {
        throw new Error(`Checkout service returned HTTP ${orderRes.status}`);
      }
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Initialize Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: "INR",
        name: "CloudSaaS Headphones",
        description: "Human Retail Checkout",
        order_id: orderData.orderId,
        handler: function (response: any) {
          clearCart();
          setIsCartOpen(false);
          router.push(`/shop/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`);
        },
        prefill: {
          name: "Human Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#000000"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      paymentObject.open();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-[#f2f2f2] rounded-md p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">Color: {item.selectedColor || "Standard"}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm">₹{item.price.toLocaleString("en-IN")} x {item.cartQuantity}</span>
                    <button onClick={() => removeFromCart(item.id, item.selectedColor)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-500">Subtotal</span>
              <span className="text-2xl font-black">₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <button onClick={handleManualCheckout} disabled={isProcessing} className="w-full py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Checkout"}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-wider">Standard Human Checkout via Razorpay</p>
          </div>
        )}
      </div>
    </>
  );
}
