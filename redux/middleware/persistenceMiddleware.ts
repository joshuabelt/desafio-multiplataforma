import { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const CART_STORAGE_KEY = "shopping_cart";

export const persistenceMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Guardar el carrito en localStorage siempre que cambie
    if (action.type.startsWith("cart/")) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
    }

    return result;
  };

export function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
}
