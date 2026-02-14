import type { MenuItem, MenuCategory, Order, HourlySale, KioskTable } from "@/types";

// Kiosk menu (Burger King style)
export const kioskCategories = [
  { id: "burger", name: "Burger", icon: "/assets/images/burger.svg" },
  { id: "biryani", name: "Biryani", icon: "/assets/images/biryani.svg" },
  { id: "combos", name: "Combos", icon: "/assets/images/combos.svg" },
  { id: "fries", name: "Fries", icon: "/assets/images/fries.svg" },
];

const UNSPLASH = "https://images.unsplash.com";
export const kioskMenuItems: (MenuItem & { bestSeller?: boolean; dietary?: "veg" | "non-veg" })[] = [
  // Burger
  { id: "k1", name: "Chicken Sandwich", categoryId: "burger", categoryName: "Burger", price: 120, available: true, bestSeller: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop` },
  { id: "k2", name: "Veg Burger", categoryId: "burger", categoryName: "Burger", price: 99, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop` },
  { id: "k3", name: "Club Sandwich", categoryId: "burger", categoryName: "Burger", price: 120, available: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop` },
  { id: "k9", name: "Double Cheese Burger", categoryId: "burger", categoryName: "Burger", price: 149, available: true, bestSeller: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop` },
  { id: "k10", name: "Chicken Wrap", categoryId: "burger", categoryName: "Burger", price: 110, available: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop` },
  { id: "k11", name: "Paneer Burger", categoryId: "burger", categoryName: "Burger", price: 119, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1594212699903-ec8a3eca50f5?w=400&h=400&fit=crop` },
  // Biryani
  { id: "k5", name: "Chicken Biryani", categoryId: "biryani", categoryName: "Biryani", price: 199, available: true, bestSeller: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop` },
  { id: "k6", name: "Veg Biryani", categoryId: "biryani", categoryName: "Biryani", price: 149, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop` },
  { id: "k12", name: "Mutton Biryani", categoryId: "biryani", categoryName: "Biryani", price: 279, available: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop` },
  { id: "k13", name: "Paneer Biryani", categoryId: "biryani", categoryName: "Biryani", price: 179, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1544025162-d76694265947?w=400&h=400&fit=crop` },
  { id: "k14", name: "Egg Biryani", categoryId: "biryani", categoryName: "Biryani", price: 129, available: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop` },
  // Combos
  { id: "k4", name: "Veg Maggies", categoryId: "combos", categoryName: "Combos", price: 80, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1569718212165-3a2854112cbbb?w=400&h=400&fit=crop` },
  { id: "k7", name: "Combo Meal", categoryId: "combos", categoryName: "Combos", price: 249, available: true, bestSeller: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop` },
  { id: "k15", name: "Family Combo", categoryId: "combos", categoryName: "Combos", price: 499, available: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop` },
  { id: "k16", name: "Kids Meal", categoryId: "combos", categoryName: "Combos", price: 149, available: true, dietary: "non-veg", image: `${UNSPLASH}/photo-1604329760661-e71dc83f2bcf?w=400&h=400&fit=crop` },
  { id: "k17", name: "Value Combo", categoryId: "combos", categoryName: "Combos", price: 199, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop` },
  // Fries
  { id: "k8", name: "French Fries", categoryId: "fries", categoryName: "Fries", price: 79, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop` },
  { id: "k18", name: "Cheese Fries", categoryId: "fries", categoryName: "Fries", price: 99, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop` },
  { id: "k19", name: "Peri Peri Fries", categoryId: "fries", categoryName: "Fries", price: 89, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1625937326071-4564e54070f1?w=400&h=400&fit=crop` },
  { id: "k20", name: "Loaded Fries", categoryId: "fries", categoryName: "Fries", price: 129, available: true, bestSeller: true, dietary: "veg", image: `${UNSPLASH}/photo-1551782450-17144efb9c50?w=400&h=400&fit=crop` },
  { id: "k21", name: "Onion Rings", categoryId: "fries", categoryName: "Fries", price: 89, available: true, dietary: "veg", image: `${UNSPLASH}/photo-1639024471283-03518883512d?w=400&h=400&fit=crop` },
];

export const kioskTables: KioskTable[] = [
  { id: "t1", label: "BOOKED", status: "running" },
  { id: "t2", label: "BOOKED", status: "running" },
  { id: "t3", label: "BOOKED", status: "running" },
  { id: "t4", label: "Table 1", status: "vacant" },
  { id: "t5", label: "Table 1", status: "vacant" },
  { id: "t6", label: "BOOKED", status: "running" },
  { id: "t7", label: "Table 1", status: "vacant" },
  { id: "t8", label: "Table 1", status: "vacant" },
  { id: "t9", label: "Table 1", status: "vacant" },
];

export const menuCategories: MenuCategory[] = [
  { id: "cat_1", name: "Starters", sortOrder: 1 },
  { id: "cat_2", name: "Main Course", sortOrder: 2 },
  { id: "cat_3", name: "Beverages", sortOrder: 3 },
  { id: "cat_4", name: "Desserts", sortOrder: 4 },
];

export const menuItems: MenuItem[] = [
  { id: "m1", name: "Spring Rolls", categoryId: "cat_1", categoryName: "Starters", price: 199, available: true },
  { id: "m2", name: "Soup of the Day", categoryId: "cat_1", categoryName: "Starters", price: 149, available: true },
  { id: "m3", name: "Paneer Tikka", categoryId: "cat_1", categoryName: "Starters", price: 249, available: true },
  { id: "m4", name: "Butter Chicken", categoryId: "cat_2", categoryName: "Main Course", price: 329, available: true },
  { id: "m5", name: "Dal Makhani", categoryId: "cat_2", categoryName: "Main Course", price: 249, available: true },
  { id: "m6", name: "Veg Biryani", categoryId: "cat_2", categoryName: "Main Course", price: 279, available: true },
  { id: "m7", name: "Cold Coffee", categoryId: "cat_3", categoryName: "Beverages", price: 99, available: true },
  { id: "m8", name: "Fresh Lime", categoryId: "cat_3", categoryName: "Beverages", price: 79, available: true },
  { id: "m9", name: "Gulab Jamun", categoryId: "cat_4", categoryName: "Desserts", price: 89, available: true },
  { id: "m10", name: "Ice Cream", categoryId: "cat_4", categoryName: "Desserts", price: 119, available: true },
];

export const sampleOrders: Order[] = [
  {
    id: "ord_1",
    type: "dine-in",
    tableNumber: 5,
    items: [
      { id: "ci_1", menuItemId: "m4", name: "Butter Chicken", price: 329, quantity: 1, modifiers: [] },
      { id: "ci_2", menuItemId: "m7", name: "Cold Coffee", price: 99, quantity: 2, modifiers: [] },
    ],
    subtotal: 527,
    discount: 0,
    tax: 26.35,
    total: 553.35,
    status: "preparing",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord_2",
    type: "takeaway",
    items: [
      { id: "ci_3", menuItemId: "m6", name: "Veg Biryani", price: 279, quantity: 1, modifiers: [] },
    ],
    subtotal: 279,
    discount: 10,
    tax: 13.45,
    total: 282.45,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const hourlySales: HourlySale[] = Array.from({ length: 12 }, (_, i) => ({
  hour: 9 + i,
  sales: Math.round(5000 + Math.random() * 8000),
  orders: Math.round(5 + Math.random() * 20),
}));
