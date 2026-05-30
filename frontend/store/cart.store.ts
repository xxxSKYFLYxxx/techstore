import { create } from "zustand";
import { CartItem } from "@/types";
import { cartApi } from "@/lib/api";

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await cartApi.get();
      set({ items: data.items });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    await cartApi.addItem(productId, quantity);
    await get().fetchCart();
  },

  updateItem: async (id, quantity) => {
    await cartApi.updateItem(id, quantity);
    await get().fetchCart();
  },

  removeItem: async (id) => {
    await cartApi.removeItem(id);
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  clear: () => set({ items: [] }),

  total: () =>
    get().items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    ),

  count: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
