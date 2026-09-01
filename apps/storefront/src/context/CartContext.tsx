"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../data/products";

interface CartItem extends Product {
  cartQuantity: number;
  selectedColor?: string;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  cartItems: CartItem[];
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (id: string, color?: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, color?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedColor === color);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedColor === color
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1, selectedColor: color }];
    });
    setIsCartOpen(true); // Auto-open cart when adding
  };

  const removeFromCart = (id: string, color?: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedColor === color)));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);

  return (
    <CartContext.Provider value={{ isCartOpen, setIsCartOpen, cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
