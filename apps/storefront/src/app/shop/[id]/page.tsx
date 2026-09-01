"use client";

import { HEADPHONES } from "../../../data/products";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

export default function ProductDetail() {
  const params = useParams();
  const product = HEADPHONES.find((p) => p.id === params.id);
  const { addToCart } = useCart();

  // React State for interactive images
  const [activeImage, setActiveImage] = useState(product?.image || "");
  const [activeColor, setActiveColor] = useState(product?.variants[0]?.name || "");

  if (!product) notFound();

  return (
    <div className="w-full pb-20">
      <h1 className="text-[120px] leading-none font-black tracking-tighter text-center uppercase mb-12 border-b border-gray-200 pb-8">
        Product Detail
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        {/* Gallery (Left - 60%) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#f2f2f2] aspect-[4/3] w-full relative flex items-center justify-center overflow-hidden">
            <button className="absolute left-4 p-2 bg-white/50 hover:bg-white rounded-full z-10"><ChevronLeft className="w-6 h-6" /></button>

            {/* The active image with mix-blend-multiply to remove the white background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeImage}
              src={activeImage}
              alt={product.name}
              className="w-3/4 h-3/4 object-contain mix-blend-multiply animate-in fade-in duration-300"
            />

            <button className="absolute right-4 p-2 bg-white/50 hover:bg-white rounded-full z-10"><ChevronRight className="w-6 h-6" /></button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Thumbnails based on variants */}
            {product.variants.slice(0, 4).map((variant, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveImage(variant.image);
                  setActiveColor(variant.name);
                }}
                className={`bg-[#f2f2f2] aspect-square relative flex items-center justify-center p-2 transition-all ${activeImage === variant.image ? 'border-2 border-black' : 'border border-transparent hover:border-gray-300'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={variant.image} alt={variant.name} className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* Details (Right - 40%) */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">{product.name}</h2>
              <p className="text-gray-500 font-medium">{product.model}</p>
            </div>
            <Heart className="w-6 h-6 text-gray-400 cursor-pointer hover:text-black" />
          </div>
          <p className="text-2xl font-bold mb-8">₹{product.price.toLocaleString("en-IN")}</p>

          <div className="mb-8">
            <h3 className="font-bold border-b border-gray-200 pb-2 mb-4 flex justify-between">Description <span>▾</span></h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Setting the bar as one of the loudest headphones in its class, the {product.name} is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-medium">Color</h3>
              <span className="text-xs text-gray-500">{activeColor}</span>
            </div>
            <div className="flex gap-3">
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(variant.image);
                    setActiveColor(variant.name);
                  }}
                  className={`w-8 h-8 rounded-full shadow-sm transition-all ${activeColor === variant.name ? 'ring-2 ring-offset-2 ring-black scale-110' : 'ring-1 ring-gray-300 hover:scale-110'}`}
                  style={{ backgroundColor: variant.hex }}
                  title={variant.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8 border-b border-gray-200 pb-12">
            <div className="flex items-center justify-between border border-gray-300 px-4 py-3 w-32 rounded-sm bg-[#f2f2f2]">
              <span className="text-gray-500 cursor-pointer">-</span>
              <span className="font-bold">1</span>
              <span className="text-gray-500 cursor-pointer">+</span>
            </div>
            <button
              onClick={() => addToCart(product, activeColor)}
              className="flex-1 bg-black text-white font-bold rounded-sm hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
            <span className="text-gray-400">SKU</span> <span className="font-bold">{product.id}</span>
            <span className="text-gray-400">Category</span> <span className="font-bold">{product.category}</span>
            <span className="text-gray-400">Tags</span> <span className="font-bold">{product.tags.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-16">
        <h2 className="text-2xl font-bold mb-8">Rating & Reviews</h2>
        <div className="flex gap-16 items-start">
          <div className="flex gap-8 items-end">
            <div className="flex items-baseline">
              <span className="text-7xl font-black tracking-tighter">4.8</span>
              <span className="text-2xl font-bold text-gray-400">/5</span>
            </div>
            <div className="flex flex-col gap-2 pb-2">
              {[5,4,3,2,1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-xs font-bold text-yellow-400">
                  <Star className="w-3 h-3 fill-current" /> {star}
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
