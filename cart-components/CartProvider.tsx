"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import type { Product } from "../types/Product";
import { CartContext, CartContextType, CartItem } from "./CartContext";

const STORAGE_KEY = "cart-storage";
const MAX_ITEMS = 20;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];

      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems >= MAX_ITEMS) {
      toast.error(`Máximo ${MAX_ITEMS} productos en el carrito`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });

    toast.success(`${product.title} agregado al carrito`);
  };

  const increaseQuantity = (productId: number) => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems >= MAX_ITEMS) {
      toast.error(`Máximo ${MAX_ITEMS} productos en el carrito`);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    const itemToUpdate = cart.find((item) => item.id === productId);

    if (!itemToUpdate) return;

    if (itemToUpdate.quantity <= 1) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      toast.success("Producto eliminado del carrito");
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success("Producto eliminado del carrito");
  };

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const value: CartContextType = {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toaster richColors position="top-right" />
    </CartContext.Provider>
  );
}