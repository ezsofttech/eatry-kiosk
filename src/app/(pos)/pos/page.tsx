"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { useKioskStore } from "@/stores/useKioskStore";
import { kioskCategories, kioskMenuItems } from "@/lib/mockData";
import { useThemeStore } from "@/stores/useThemeStore";
import { useKioskOverlay } from "@/contexts/KioskOverlayContext";
import { Minus, Plus, Receipt, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

const TAX_RATE = 5;
const GST_RATE = 18;

export default function POSPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(kioskCategories[0].id);
  const [customizingItem, setCustomizingItem] = useState<
    (typeof kioskMenuItems)[0] | null
  >(null);
  const [sizeOption, setSizeOption] = useState<"Small" | "Medium">("Small");
  const [customizeQty, setCustomizeQty] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<
    { name: string; price: number }[]
  >([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "non-veg" | "veg"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const [tableNumber, setTableNumber] = useState<string>("");

  const ADDON_PRICE = 99;
  const ADDONS = [
    { name: "Extra Cheese", price: ADDON_PRICE },
    { name: "Extra Patty", price: ADDON_PRICE },
    { name: "Crispy Bacon", price: ADDON_PRICE },
  ];

  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTax,
    getTotal,
    setOrderType: setCartOrderType,
    setTableNumber: setCartTableNumber,
    clearCart,
  } = useCartStore();
  const { orderId, setOrderId } = useKioskStore();
  const { resolved } = useThemeStore();
  const { setOverlayOpen } = useKioskOverlay();
  const isDark = resolved === "dark";

  const filteredItems = kioskMenuItems
    .filter((m) => m.categoryId === activeCategory)
    .filter((m) => {
      if (activeFilter === "all") return true;
      const dietary = "dietary" in m ? m.dietary : undefined;
      if (activeFilter === "non-veg") return dietary === "non-veg";
      if (activeFilter === "veg") return dietary === "veg";
      return true;
    })
    .filter((m) =>
      searchQuery.trim() === ""
        ? true
        : m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const activeCategoryName =
    kioskCategories.find((cat) => cat.id === activeCategory)?.name ?? "Items";
  const subtotal = getSubtotal();
  const tax = getTax(TAX_RATE);
  const total = getTotal(TAX_RATE);
  const orderLabel = orderType === "dine-in" ? "Dine in" : "Take away";
  const displayOrderId = orderId
    ? `#${orderId.replace("#", "")}`
    : `#${Math.floor(Math.random() * 90000) + 10000}`;

  const handleProceedToPayment = () => {
    const generatedOrderId = `#${Math.floor(Math.random() * 900000) + 100000}`;
    setOrderId(generatedOrderId);
    setCartOrderType(orderType);
    if (tableNumber) setCartTableNumber(parseInt(tableNumber, 10));
    router.push("/payment");
  };

  const handleNewOrder = () => {
    clearCart();
    setOrderId(null);
    setTableNumber("");
    useKioskStore.getState().setOrderId(null);
  };

  const handleOrderTypeChange = (type: "dine-in" | "takeaway") => {
    setOrderType(type);
    setCartOrderType(type);
    if (type === "takeaway") setCartTableNumber(undefined);
  };

  const handleAddClick = (item: (typeof kioskMenuItems)[0]) => {
    setCustomizingItem(item);
    setCustomizeQty(1);
    setSelectedAddons([]);
  };

  const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
  const customizeUnitPrice = (customizingItem?.price ?? 0) + addonTotal;
  const customizeTotal = customizeUnitPrice * customizeQty;

  const toggleAddon = (addon: { name: string; price: number }) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleAddToOrder = () => {
    if (!customizingItem) return;
    for (let i = 0; i < customizeQty; i++) {
      addItem({
        menuItemId: customizingItem.id,
        name: customizingItem.name,
        price: customizeUnitPrice,
        quantity: 1,
        modifiers:
          selectedAddons.length > 0 ? selectedAddons : undefined,
      });
    }
    setCustomizingItem(null);
    setCustomizeQty(1);
    setSelectedAddons([]);
  };

  const getQuantity = (menuItemId: string) =>
    items
      .filter((i) => i.menuItemId === menuItemId)
      .reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    setOverlayOpen(!!customizingItem);
    return () => setOverlayOpen(false);
  }, [customizingItem, setOverlayOpen]);

  return (
    <div className="flex flex-1 flex-col lg:flex-row min-h-0 pt-10 sm:pt-12 md:pt-14 laptop:pt-14 h-screen overflow-hidden">
      {/* Left: Search + Categories + Filters + Menu grid (kiosk type) */}
      <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-3 md:px-4 md:pt-4 md:pb-0 lg:px-4 lg:pt-4 lg:pb-0 laptop:px-5 laptop:pt-5 laptop:pb-0 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col flex-1 min-h-0 w-full">
          <div className="shrink-0 pt-8 sm:pt-0">
            <div
              className={cn(
                "rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 mb-3 sm:mb-4 flex items-center gap-2",
                isDark ? "bg-zinc-800" : "bg-zinc-200"
              )}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-xs sm:text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-500 hover:text-gray-700 shrink-0"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 laptop:gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-3 laptop:pb-2 pl-0.5 pr-4">
              {kioskCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center shrink-0 rounded-full border-2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 p-2 transition-colors text-xs",
                    activeCategory === cat.id
                      ? "border-orange-500 bg-orange-500/10"
                      : isDark ? "border-zinc-600" : "border-zinc-300"
                  )}
                >
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={36}
                    height={36}
                    className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  />
                  {activeCategory === cat.id && (
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] sm:text-[10px] shadow-sm">✓</span>
                  )}
                  <span
                    className={cn(
                      "text-[10px] sm:text-xs font-medium truncate max-w-full text-center leading-tight mt-0.5",
                      activeCategory === cat.id && "text-orange-500"
                    )}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
            <div className={cn("border-t border-dashed my-2 sm:my-3 laptop:my-2", isDark ? "border-zinc-600" : "border-gray-300")} />
            <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-3 sm:mb-4 laptop:mb-3">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={cn(
                  "rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium kiosk-tap transition-colors",
                  activeFilter === "all" ? "bg-orange-500 text-white" : isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                )}
              >
                All {activeCategoryName}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("non-veg")}
                className={cn(
                  "rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 kiosk-tap transition-colors",
                  activeFilter === "non-veg" ? "bg-orange-500 text-white" : isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                )}
              >
                <span className={cn("w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center shrink-0", activeFilter === "non-veg" ? "border-white" : "border-red-500")}>
                  <span className={cn("w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full", activeFilter === "non-veg" ? "bg-white" : "bg-red-500")} />
                </span>
                <span className="hidden sm:inline">Non-Veg</span>
                <span className="sm:hidden">Non-Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("veg")}
                className={cn(
                  "rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 kiosk-tap transition-colors",
                  activeFilter === "veg" ? "bg-orange-500 text-white" : isDark ? "bg-zinc-700 text-white hover:bg-zinc-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                )}
              >
                <span className={cn("w-3 h-3 sm:w-4 sm:h-4 rounded border-2 flex items-center justify-center shrink-0", activeFilter === "veg" ? "border-white" : "border-green-500")}>
                  <span className={cn("w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full", activeFilter === "veg" ? "bg-white" : "bg-green-500")} />
                </span>
                <span className="hidden sm:inline">Veg</span>
                <span className="sm:hidden">Veg</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            {filteredItems.length === 0 ? (
              <div className={cn("flex flex-col items-center justify-center py-16 text-center", isDark ? "text-gray-400" : "text-gray-500")}>
                <p className="text-lg font-medium">No items match this filter</p>
                <p className="text-sm mt-1">Try a different category or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3">
                {filteredItems.map((item) => {
                  const qty = getQuantity(item.id);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-lg sm:rounded-2xl overflow-hidden border",
                        isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"
                      )}
                    >
                      <div className="relative aspect-[4/3] bg-orange-500/20 overflow-hidden rounded-t-lg sm:rounded-t-2xl">
                        <Image
                          src={
                            item.image ?? "/assets/images/food-placeholder.svg"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                        {item.bestSeller && (
                          <span className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 rounded-full bg-red-500 px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-white">
                            Best seller
                          </span>
                        )}
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-xs sm:text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-orange-500 font-bold mt-0.5 text-xs sm:text-sm">₹{item.price.toFixed(2)}</p>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleAddClick(item)}
                            className="mt-1.5 w-full rounded-lg bg-orange-500 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-orange-600 kiosk-tap"
                          >
                            + ADD
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1.5 kiosk-tap">
                            <button
                              type="button"
                              onClick={() => {
                                const first = items.find((i) => i.menuItemId === item.id);
                                if (first) updateQuantity(first.id, first.quantity - 1);
                              }}
                              className="rounded-lg bg-orange-500 p-1 text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <span className="font-semibold w-6 text-center text-xs sm:text-sm">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleAddClick(item)}
                              className="rounded-lg bg-orange-500 p-1 text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Order panel (kiosk type) - always visible in POS */}
      <div
        className={cn(
          "w-full lg:w-[340px] laptop:w-[320px] shrink-0 flex flex-col rounded-2xl overflow-hidden border",
          "m-0.5 lg:mx-3 lg:mt-5 max-h-[calc(100vh-1.5rem)]",
          isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"
        )}
      >
        <div className="p-3 sm:p-4 pb-2 sm:pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className={cn("text-sm sm:text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>Current Order</h2>
                <Link
                  href="/kot"
                  className={cn(
                    "p-1.5 rounded-lg kiosk-tap transition-colors",
                    isDark ? "hover:bg-zinc-800 text-orange-400" : "hover:bg-gray-100 text-orange-600"
                  )}
                  title="Kitchen Order Ticket"
                >
                  <ChefHat className="w-5 h-5" />
                </Link>
              </div>
              <p className={cn("text-xs sm:text-sm mt-0.5", isDark ? "text-gray-400" : "text-gray-500")}>
                {orderLabel} • {displayOrderId}
              </p>
            </div>
            {items.length > 0 && (
              <span
                className={cn(
                  "rounded-lg px-2.5 sm:px-3 py-1 text-2xs sm:text-xs font-medium shrink-0",
                  isDark ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800"
                )}
              >
                {items.reduce((s, i) => s + i.quantity, 0)} ITEMS
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleOrderTypeChange("dine-in")}
              className={cn(
                "flex-1 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium kiosk-tap transition-colors",
                orderType === "dine-in"
                  ? "bg-orange-500 text-white"
                  : isDark
                    ? "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Dine-in
            </button>
            <button
              type="button"
              onClick={() => handleOrderTypeChange("takeaway")}
              className={cn(
                "flex-1 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium kiosk-tap transition-colors",
                orderType === "takeaway"
                  ? "bg-orange-500 text-white"
                  : isDark
                    ? "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Takeaway
            </button>
          </div>
          {orderType === "dine-in" && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Table number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className={cn(
                  "w-full rounded-lg sm:rounded-xl border px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm outline-none",
                  isDark
                    ? "bg-zinc-800 border-zinc-600 text-white placeholder:text-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                )}
              />
            </div>
          )}
        </div>

        <div
          className={cn(
            "border-t border-dashed shrink-0 mt-0",
            isDark ? "border-zinc-600" : "border-gray-300"
          )}
        />
        <div className="flex-1 overflow-auto scrollbar-hide p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
          {items.length === 0 ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center py-12 px-2 text-center min-h-[10rem]",
                isDark ? "text-gray-500" : "text-gray-400"
              )}
            >
              <Receipt className="w-12 h-12 mb-3 opacity-50 shrink-0" />
              <p className="text-sm font-medium">No items in order</p>
              <p className="text-xs mt-1.5">Add items from the menu</p>
            </div>
          ) : (
            items.map((item) => {
              const menuItem = kioskMenuItems.find((m) => m.id === item.menuItemId);
              const dietary = menuItem && "dietary" in menuItem ? menuItem.dietary : undefined;
              return (
                <div key={item.id} className={cn("pb-3 sm:pb-4 border-b last:border-0 last:pb-0", isDark ? "border-zinc-700/80" : "border-gray-100")}>
                  <div className="flex gap-2 sm:gap-3">
                    <span
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center shrink-0 mt-0.5",
                        dietary === "veg" ? "bg-green-500" : "bg-red-500"
                      )}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-bold text-xs sm:text-base", isDark ? "text-white" : "text-gray-900")}>{item.name}</p>
                      <select
                        className={cn(
                          "mt-1 text-xs sm:text-sm rounded-lg border px-2 sm:px-2.5 py-1 sm:py-1.5 cursor-pointer w-full max-w-[5rem] sm:max-w-[6rem]",
                          isDark ? "border-zinc-600 bg-zinc-800 text-white" : "border-gray-300 bg-gray-50 text-gray-700"
                        )}
                      >
                        <option>Half</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <p className={cn("font-semibold text-xs sm:text-base", isDark ? "text-white" : "text-gray-900")}>₹{item.price.toFixed(2)}</p>
                      <div className="flex rounded-lg sm:rounded-xl overflow-hidden border-2 border-orange-500 mt-1 sm:mt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) removeItem(item.id);
                            else updateQuantity(item.id, item.quantity - 1);
                          }}
                          className="bg-orange-500 text-white p-1 sm:p-1.5 kiosk-tap hover:bg-orange-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className={cn("min-w-[1.5rem] sm:min-w-[1.75rem] px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center justify-center font-semibold text-xs sm:text-sm border-x border-orange-500/40", isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900")}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddClick(kioskMenuItems.find((m) => m.id === item.menuItemId)!)}
                          className="bg-orange-500 text-white p-1 sm:p-1.5 kiosk-tap hover:bg-orange-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div
          className={cn(
            "p-3 sm:p-4 pt-2 sm:pt-3 border-t border-dashed space-y-2 shrink-0",
            isDark ? "border-zinc-600" : "border-gray-300"
          )}
        >
          <div
            className={cn(
              "flex justify-between text-xs sm:text-sm",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
          >
            <span>Item Total</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div
            className={cn(
              "flex justify-between text-xs sm:text-sm",
              isDark ? "text-gray-300" : "text-gray-600"
            )}
          >
            <span>GST & Other Charges</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm sm:text-lg pt-1">
            <span className={isDark ? "text-white" : "text-gray-900"}>To Pay</span>
            <span className="text-orange-500">₹{total.toFixed(0)}</span>
          </div>
          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={items.length === 0}
            className="mt-2 block w-full rounded-lg sm:rounded-xl py-3 sm:py-4 text-center text-sm sm:text-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors kiosk-tap"
          >
            Pay ₹{total.toFixed(0)}
          </button>
          <button
            type="button"
            onClick={handleNewOrder}
            className={cn(
              "mt-2 w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium transition-colors kiosk-tap",
              isDark
                ? "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            New Order
          </button>
        </div>
      </div>

      {/* Customization modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCustomizingItem(null)}
            aria-hidden
          />
          <div
            className={cn(
              "relative w-full max-w-md max-h-[90vh] flex flex-col rounded-[18px] overflow-hidden shadow-xl",
              isDark ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-gray-100"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between p-5 shrink-0",
                isDark ? "border-b border-zinc-700" : "border-b border-gray-100"
              )}
            >
              <div className="min-w-0">
                <h3
                  className={cn(
                    "font-bold text-lg truncate",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {customizingItem.name}
                </h3>
                <p
                  className={cn(
                    "text-sm truncate",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  Add to order
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
              <div>
                <p
                  className={cn(
                    "font-bold text-base mb-3",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Size
                </p>
                <div className="space-y-2">
                  {(["Small", "Medium"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSizeOption(size)}
                      className={cn(
                        "w-full flex justify-between items-center rounded-xl px-4 py-4 text-left text-base border transition-colors",
                        sizeOption === size
                          ? "bg-orange-500 border-orange-400 text-white"
                          : isDark
                            ? "bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700"
                            : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <span>{size}</span>
                      <span className="text-gray-500">₹99</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p
                  className={cn(
                    "font-bold text-base mb-3",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Add Ons
                </p>
                <div className="space-y-2">
                  {ADDONS.map((addon) => {
                    const isSelected = selectedAddons.some(
                      (a) => a.name === addon.name
                    );
                    return (
                      <button
                        key={addon.name}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={cn(
                          "w-full flex justify-between items-center rounded-xl px-4 py-4 text-left text-base border transition-colors",
                          isSelected
                            ? "bg-orange-500 border-orange-400 text-white"
                            : isDark
                              ? "bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700"
                              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <span>{addon.name}</span>
                        <span>+₹{addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className={cn(
                "shrink-0 p-5 border-t flex flex-wrap items-center justify-between gap-4",
                isDark ? "border-zinc-700 bg-zinc-900" : "border-gray-100 bg-white"
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "font-bold text-lg",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  ₹{customizeUnitPrice.toFixed(2)}
                </span>
                <div className="flex rounded-xl overflow-hidden border-2 border-orange-500">
                  <button
                    type="button"
                    className="bg-orange-500 text-white p-2.5 hover:bg-orange-600"
                    onClick={() => setCustomizeQty((q) => q + 1)}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span
                    className={cn(
                      "min-w-[2.5rem] px-3 py-2.5 flex items-center justify-center font-bold border-x border-orange-500/40",
                      isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900"
                    )}
                  >
                    {customizeQty}
                  </span>
                  <button
                    type="button"
                    className="bg-orange-500 text-white p-2.5 hover:bg-orange-600 disabled:opacity-50"
                    onClick={() =>
                      setCustomizeQty((q) => Math.max(1, q - 1))
                    }
                    disabled={customizeQty <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToOrder}
                className="rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-base text-white hover:bg-orange-600"
              >
                Add Item | ₹{customizeTotal.toFixed(0)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
