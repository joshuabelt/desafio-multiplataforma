import { Middleware } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "shopping_cart";

export const persistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Guardar el carrito en localStorage siempre que cambie
    if (typeof action === "object" && action !== null && "type" in action && typeof action.type === "string" && action.type.startsWith("cart/")) {
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
