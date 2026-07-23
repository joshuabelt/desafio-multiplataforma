import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../data/products"; 

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);