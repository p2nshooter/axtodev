"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  bookId: string;
  slug: string;
  title: string;
  coverImageUrl: string | null;
  priceCents: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (bookId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.bookId === item.bookId)) return;
        set({ items: [...get().items, item] });
      },
      removeItem: (bookId) => set({ items: get().items.filter((i) => i.bookId !== bookId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "axto-cart" },
  ),
);
