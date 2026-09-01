"use client";

import { useState } from "react";
import { HEADPHONES } from "../../data/products";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function ShopCatalog() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from our data
  const categories = Array.from(new Set(HEADPHONES.map(p => p.category)));

  // Filter logic
  const filteredProducts = selectedCategory
    ? HEADPHONES.filter(p => p.category === selectedCategory)
    : HEADPHONES;

  return (
    <div className="w-full">
      <h1 className="text-7xl font-black tracking-tighter text-center mb-16 uppercase">The Shop</h1>

      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold">All Products</h2>
        <div className="text-sm text-gray-500 flex items-center gap-4">
          <span>Showing {filteredProducts.length} Results</span>
          <span className="flex items-center gap-2">Sort by: <span className="bg-gray-200 px-3 py-1 rounded-full text-black font-medium">Most Popular ▾</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <div className="col-span-1 space-y-8">
          <div>
            <h3 className="font-bold mb-4">By Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedCategory === null ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <Link href={`/shop/${product.id}`} className="bg-[#f2f2f2] aspect-square relative p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-start z-10 relative">
                  {product.badge ? (
                    <span className="bg-gray-400/30 text-gray-700 px-2 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider backdrop-blur-sm">
                      {product.badge}
                    </span>
                  ) : <div/>}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                    <button className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"><Heart className="w-4 h-4" /></button>
                    <button
                      onClick={(e) => { e.preventDefault(); addToCart(product, product.variants[0]?.name); }}
                      className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                </div>
              </Link>
              <div className="flex justify-between items-center mt-3">
                <span className="font-medium text-sm">{product.name}</span>
                <span className="font-bold text-sm">₹{product.price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
