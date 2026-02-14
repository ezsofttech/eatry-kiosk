import { create } from "zustand";
import type { KioskOrderType, KioskTable } from "@/types";

interface KioskState {
  orderType: KioskOrderType | null;
  selectedTable: KioskTable | null;
  orderId: string | null;
  paymentMethod: "upi" | "counter" | "card" | null;
  language: string;
  setOrderType: (type: KioskOrderType | null) => void;
  setSelectedTable: (table: KioskTable | null) => void;
  setOrderId: (id: string | null) => void;
  setPaymentMethod: (method: KioskState["paymentMethod"]) => void;
  setLanguage: (lang: string) => void;
  resetOrder: () => void;
}

export const useKioskStore = create<KioskState>((set) => ({
  orderType: null,
  selectedTable: null,
  orderId: null,
  paymentMethod: null,
  language: "EN",
  setOrderType: (orderType) => set({ orderType }),
  setSelectedTable: (selectedTable) => set({ selectedTable }),
  setOrderId: (orderId) => set({ orderId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setLanguage: (language) => set({ language }),
  resetOrder: () =>
    set({
      orderType: null,
      selectedTable: null,
      orderId: null,
      paymentMethod: null,
    }),
}));
