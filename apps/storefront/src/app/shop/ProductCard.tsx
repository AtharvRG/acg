"use client";

import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { Product } from "../../data/products";

const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlN2U3ZTciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2EwYTBhMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} key={product.id} className="group cursor-pointer">
      <div className="bg-[#f2f2f2] aspect-square relative p-4 flex flex-col justify-between overflow-hidden">
        {/* Badges & Actions */}
        <div className="flex justify-between items-start z-10 relative">
          {product.badge ? (
            <span className="bg-gray-400/30 text-gray-700 px-2 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider backdrop-blur-sm">
              {product.badge}
            </span>
          ) : <div />}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white/80 p-2 rounded-full hover:bg-white"><Heart className="w-4 h-4" /></button>
            <button className="bg-white/80 p-2 rounded-full hover:bg-white"><ShoppingCart className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Image Placeholder (Waiting for your images) */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="font-medium text-sm">{product.name}</span>
        <span className="font-bold text-sm">₹{product.price.toLocaleString("en-IN")}</span>
      </div>
    </Link>
  );
}
