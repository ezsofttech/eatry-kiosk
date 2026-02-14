// Order & Cart
export type OrderType = "dine-in" | "takeaway" | "delivery";

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: { name: string; price: number }[];
  notes?: string;
}

export interface Order {
  id: string;
  type: OrderType;
  tableNumber?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "served" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  image?: string;
  description?: string;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
}

// Dashboard
export interface DashboardMetrics {
  todaySales: number;
  todayOrders: number;
  activeOrders: number;
  averageOrderValue: number;
}

export interface HourlySale {
  hour: number;
  sales: number;
  orders: number;
}

// Kiosk
export type KioskOrderType = "dine-in" | "takeaway";

export type TableStatus = "vacant" | "running";

export interface KioskTable {
  id: string;
  label: string;
  status: TableStatus;
}

export interface MenuItemOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemSize {
  id: string;
  name: string;
  price: number;
}
