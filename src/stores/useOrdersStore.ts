import { create } from "zustand";
import type { Order } from "@/types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  getActiveOrders: () => Order[];
  getTodayOrders: () => Order[];
  getTodaySales: () => number;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),
  getActiveOrders: () =>
    get().orders.filter((o) =>
      ["pending", "confirmed", "preparing", "ready"].includes(o.status)
    ),
  getTodayOrders: () => {
    const today = new Date().toDateString();
    return get().orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  },
  getTodaySales: () =>
    get()
      .getTodayOrders()
      .reduce((s, o) => s + o.total, 0),
}));
