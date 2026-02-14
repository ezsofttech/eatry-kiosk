import { create } from "zustand";
import type { CartItem, OrderType } from "@/types";

interface CartState {
  items: CartItem[];
  orderType: OrderType;
  tableNumber?: number;
  discountPercent: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (num?: number) => void;
  setDiscount: (percent: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: (rate?: number) => number;
  getTotal: (taxRate?: number) => number;
}

function generateId() {
  return `ci_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orderType: "dine-in",
  discountPercent: 0,
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        { ...item, id: generateId() } as CartItem,
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter((i) => i.quantity > 0),
    })),
  setOrderType: (orderType) => set({ orderType }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setDiscount: (discountPercent) => set({ discountPercent }),
  clearCart: () => set({ items: [], discountPercent: 0 }),
  getSubtotal: () => {
    const { items, discountPercent } = get();
    const raw = items.reduce((s, i) => s + (i.price + (i.modifiers?.reduce((m, mod) => m + mod.price, 0) ?? 0)) * i.quantity, 0);
    return raw * (1 - discountPercent / 100);
  },
  getTax: (rate = 5) => get().getSubtotal() * (rate / 100),
  getTotal: (taxRate = 5) => {
    const subtotal = get().getSubtotal();
    return subtotal + get().getTax(taxRate);
  },
}));
