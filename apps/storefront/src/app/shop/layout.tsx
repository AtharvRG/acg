"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartProvider, useCart } from "../../context/CartContext";
import { CartDrawer } from "../../components/CartDrawer";

// Extracted Nav to use Cart Hook
function StoreNav() {
  const { setIsCartOpen, cartItems } = useCart();
  const itemCount = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

  return (
    <nav className="w-full px-8 py-6 flex items-center justify-between border-b border-gray-100 bg-white">
      <Link href="/" className="font-black text-2xl tracking-tighter">N/</Link>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="#" className="hover:opacity-60">About</Link>
        <Link href="/shop" className="hover:opacity-60">Collections</Link>
        <Link href="#" className="hover:opacity-60">Projects</Link>
      </div>
      <button
        onClick={() => setIsCartOpen(true)}
        className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-gray-800 transition-colors relative"
      >
        <ShoppingCart className="w-4 h-4" />
        Your Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white text-black">
        <StoreNav />
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-8">
          {children}
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
