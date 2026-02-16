import { create } from "zustand";
import type { CartItem } from "@/types";

export type KitchenOrderStatus = "preparing" | "ready";

export interface KitchenOrder {
  id: string;
  orderId: string; // display e.g. #55435
  type: "dine-in" | "takeaway";
  tableNumber?: number;
  items: CartItem[];
  status: KitchenOrderStatus;
  createdAt: string;
}

interface KitchenState {
  orders: KitchenOrder[];
  addOrder: (order: Omit<KitchenOrder, "id" | "createdAt" | "status">) => void;
  setOrderStatus: (id: string, status: KitchenOrderStatus) => void;
  removeOrder: (id: string) => void;
  clearAll: () => void;
  seedMockOrders: () => void;
}

function generateId() {
  return `kot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getMockOrders(): KitchenOrder[] {
  const now = Date.now();
  const ms = (mins: number) => new Date(now - mins * 60 * 1000).toISOString();

  const mockItems: CartItem[] = [
    { id: "ci_m1", menuItemId: "m1", name: "Margherita Pizza", price: 299, quantity: 2 },
    { id: "ci_m2", menuItemId: "m2", name: "Garlic Bread", price: 99, quantity: 1 },
    { id: "ci_m3", menuItemId: "m3", name: "Cold Coffee", price: 149, quantity: 2, modifiers: [{ name: "Extra shot", price: 30 }] },
    { id: "ci_m4", menuItemId: "m4", name: "Paneer Tikka", price: 249, quantity: 1 },
    { id: "ci_m5", menuItemId: "m5", name: "Dal Makhani", price: 199, quantity: 2 },
    { id: "ci_m6", menuItemId: "m6", name: "Butter Naan", price: 49, quantity: 4 },
    { id: "ci_m7", menuItemId: "m7", name: "Veg Burger", price: 129, quantity: 1 },
    { id: "ci_m8", menuItemId: "m8", name: "French Fries", price: 99, quantity: 2 },
  ];

  return [
    {
      id: "kot_mock_1",
      orderId: "#K-1001",
      type: "dine-in",
      tableNumber: 5,
      items: [mockItems[0], mockItems[1]],
      status: "preparing",
      createdAt: ms(8),
    },
    {
      id: "kot_mock_2",
      orderId: "#K-1002",
      type: "takeaway",
      items: [mockItems[2], mockItems[3]],
      status: "preparing",
      createdAt: ms(5),
    },
    {
      id: "kot_mock_3",
      orderId: "#K-1003",
      type: "dine-in",
      tableNumber: 12,
      items: [mockItems[4], mockItems[5]],
      status: "ready",
      createdAt: ms(15),
    },
    {
      id: "kot_mock_4",
      orderId: "#K-1004",
      type: "dine-in",
      tableNumber: 3,
      items: [mockItems[6], mockItems[7]],
      status: "ready",
      createdAt: ms(22),
    },
  ];
}

export const useKitchenStore = create<KitchenState>((set) => ({
  orders: getMockOrders(),
  addOrder: (order) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id: generateId(),
          status: "preparing" as KitchenOrderStatus,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  setOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id),
    })),
  clearAll: () => set({ orders: [] }),
  seedMockOrders: () => set({ orders: getMockOrders() }),
}));
