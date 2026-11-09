import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (variantId: number) => void;
  setQty: (variantId: number, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add(item) {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.variantId === item.variantId);
        if (idx >= 0) {
          const merged = items[idx].quantity + item.quantity;
          items[idx].quantity = Math.min(merged, item.stock);
        } else {
          items.push(item);
        }
        set({ items });
      },
      remove(variantId) {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      setQty(variantId, qty) {
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i
          ),
        });
      },
      clear() {
        set({ items: [] });
      },
      subtotal() {
        return get().items.reduce((s, i) => s + i.price * i.quantity, 0);
      },
      count() {
        return get().items.reduce((s, i) => s + i.quantity, 0);
      },
    }),
    { name: "phone-cart" }
  )
);