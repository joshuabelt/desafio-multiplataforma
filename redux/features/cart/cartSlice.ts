import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../types/Product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Cargar estado inicial desde localStorage (solo en cliente)
const getInitialState = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [] };
  }

  try {
    const stored = localStorage.getItem("shopping_cart");
    return { items: stored ? JSON.parse(stored) : [] };
  } catch {
    return { items: [] };
  }
};

const initialState: CartState = getInitialState();

const MAX_ITEMS = 20;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

      if (totalItems >= MAX_ITEMS) {
        return;
      }

      const existing = state.items.find((item) => item.id === action.payload.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

      if (totalItems >= MAX_ITEMS) {
        return;
      }

      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;