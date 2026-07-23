import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../data/products";
import{CartContext} from "../CartContext";
import{CartProvider} from "../CartProvider";
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  
  return context;
};