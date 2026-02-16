"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/stores/useKioskStore";
import { useCartStore } from "@/stores/useCartStore";
import { kioskCategories, kioskMenuItems } from "@/lib/mockData";
import { useThemeStore } from "@/stores/useThemeStore";
import { useKioskOverlay } from "@/contexts/KioskOverlayContext";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const TAX_RATE = 5;
const GST_RATE = 18;
const ITEMS_PER_TWO_ROWS = 8; // 2 rows × 4 cols (laptop 1536px) or 2 rows × 3 cols (md)

export default function MenuPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(kioskCategories[0].id);
  const [customizingItem, setCustomizingItem] = useState<typeof kioskMenuItems[0] | null>(null);
  const [sizeOption, setSizeOption] = useState<"Small" | "Medium">("Small");
  const [customizeQty, setCustomizeQty] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "non-veg" | "veg">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const ADDON_PRICE = 99;
  const ADDONS = [
    { name: "Extra Cheese", price: ADDON_PRICE },
    { name: "Extra Patty", price: ADDON_PRICE },
    { name: "Crispy Bacon", price: ADDON_PRICE },
  ];
  const { orderType, selectedTable } = useKioskStore();
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTax,
    getTotal,
  } = useCartStore();
  const { resolved } = useThemeStore();
  const { setOverlayOpen } = useKioskOverlay();
  const isDark = resolved === "dark";

  useEffect(() => {
    if (!orderType) router.replace("/order-type");
  }, [orderType, router]);

  useEffect(() => {
    setOverlayOpen(!!customizingItem);
    return () => setOverlayOpen(false);
  }, [customizingItem, setOverlayOpen]);

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
      searchQuery.trim() === "" ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Get current category name
  const activeCategoryName = kioskCategories.find((cat) => cat.id === activeCategory)?.name || "Items";
  const subtotal = getSubtotal();
  const tax = getTax(TAX_RATE);
  const total = getTotal(TAX_RATE);
  const orderLabel = orderType === "dine-in" ? "Dine in" : "Take away";
  const orderId = selectedTable?.id ? `#${selectedTable.label.replace("Table ", "")}${19938}` : "#19938";

  const handleProceedToPayment = () => {
    // Generate token/order ID
    const generatedOrderId = `#${Math.floor(Math.random() * 900000) + 100000}`;
    useKioskStore.getState().setOrderId(generatedOrderId);
    router.push("/payment");
  };

  const handleBackToHome = () => {
    useCartStore.getState().clearCart();
    setShowHomeConfirm(false);
    router.push("/");
  };

  const handleAddClick = (item: typeof kioskMenuItems[0]) => {
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
        modifiers: selectedAddons.length ? selectedAddons : undefined,
      });
    }
    setCustomizingItem(null);
    setCustomizeQty(1);
    setSelectedAddons([]);
  };

  const getQuantity = (menuItemId: string) =>
    items.filter((i) => i.menuItemId === menuItemId).reduce((s, i) => s + i.quantity, 0);

  if (!orderType) return null;

  return (
    <div className="flex flex-1 flex-col lg:flex-row min-h-0 pt-10 sm:pt-12 md:pt-14 laptop:pt-14 overflow-hidden">
      {/* Left: Search + Categories + Filters (fixed) + Menu grid (scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-3 md:px-4 md:pt-4 md:pb-0 lg:px-4 lg:pt-4 lg:pb-0 laptop:px-5 laptop:pt-5 laptop:pb-0 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col flex-1 min-h-0 w-full">
          {/* Fixed: Search, Categories, Filters */}
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
                  <span className={cn("text-[10px] sm:text-xs font-medium truncate max-w-full text-center leading-tight mt-0.5", activeCategory === cat.id && "text-orange-500")}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
            {/* Dotted separator between categories and filters */}
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

          {/* Scrollable: All menu items in one grid */}
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
                          src={item.image ?? "/assets/images/food-placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

      {/* Right: Order summary - only show when at least one item is added */}
      {items.length > 0 && (
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
                <h2 className={cn("text-sm sm:text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>Your Order</h2>
                <p className={cn("text-xs sm:text-sm mt-0.5", isDark ? "text-gray-400" : "text-gray-500")}>
                  {orderLabel} • {orderId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-lg px-2.5 sm:px-3 py-1 text-2xs sm:text-xs font-medium shrink-0",
                    isDark ? "bg-orange-500 text-white" : "bg-orange-200 text-orange-800"
                  )}
                >
                  {items.reduce((s, i) => s + i.quantity, 0)} ITEMS
                </span>
              </div>
            </div>
          </div>
          {/* Dotted separator between header and list */}
          <div className={cn("border-t border-dashed", isDark ? "border-zinc-600" : "border-gray-300")} />
          <div className="flex-1 overflow-auto scrollbar-hide p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
            {items.map((item) => {
              const menuItem = kioskMenuItems.find((m) => m.id === item.menuItemId);
              const dietary = menuItem && "dietary" in menuItem ? menuItem.dietary : undefined;
              return (
                <div key={item.id} className={cn("pb-3 sm:pb-4 border-b last:border-0 last:pb-0", isDark ? "border-zinc-700/80" : "border-gray-100")}>
                  <div className="flex gap-2 sm:gap-3">
                    {/* Dietary: red/green square with white circle inside */}
                    <span
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center shrink-0 mt-0.5",
                        dietary === "veg" ? "bg-green-500" : "bg-red-500"
                      )}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                    </span>
                    {/* Left: name + Half dropdown */}
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
                    {/* Right: price + quantity control */}
                    <div className="flex flex-col items-end shrink-0">
                      <p className={cn("font-semibold text-xs sm:text-base", isDark ? "text-white" : "text-gray-900")}>₹{item.price.toFixed(2)}</p>
                      <div className="flex rounded-lg sm:rounded-xl overflow-hidden border-2 border-orange-500 mt-1 sm:mt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity - 1);
                          }}
                          className="bg-orange-500 text-white p-1 sm:p-1.5 kiosk-tap hover:bg-orange-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className={cn("min-w-[1.5rem] sm:min-w-[1.75rem] px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center justify-center font-semibold text-xs sm:text-sm border-x border-orange-500/40", isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900")}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity + 1);
                          }}
                          className="bg-orange-500 text-white p-1 sm:p-1.5 kiosk-tap hover:bg-orange-600"
                          aria-label="Increase quantity"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={cn("p-3 sm:p-4 pt-2 sm:pt-3 border-t border-dashed space-y-2", isDark ? "border-zinc-600" : "border-gray-300")}>
            <div className={cn("flex justify-between text-xs sm:text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
              <span>Item Total</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className={cn("flex justify-between text-xs sm:text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
              <span>GST & Other Charges</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm sm:text-lg pt-1">
              <span className={isDark ? "text-white" : "text-gray-900"}>To Pay</span>
              <span className="text-orange-500">₹{total.toFixed(0)}</span>
            </div>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProceedToPayment();
              }}
              className="mt-2 sm:mt-3 block w-full rounded-lg sm:rounded-xl py-3 sm:py-4 text-center text-sm sm:text-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors kiosk-tap"
            >
              Proceed to Pay ₹{total.toFixed(0)}
            </Link>

            <button
              type="button"
              onClick={() => setShowHomeConfirm(true)}
              className={cn(
                "mt-2 w-full rounded-lg sm:rounded-xl py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium transition-colors kiosk-tap",
                isDark
                  ? "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Clear order confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
          <div
            className="absolute inset-0 bg-black/50 pointer-events-auto"
            onClick={() => setShowClearConfirm(false)}
            aria-hidden
          />
          <div
            className={cn(
              "relative w-full max-w-sm rounded-[18px] overflow-hidden shadow-xl pointer-events-auto",
              isDark ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-gray-100"
            )}
          >
            <div className={cn("p-6", isDark ? "border-b border-zinc-700" : "border-b border-gray-100")}>
              <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                Empty Your Order?
              </h3>
              <p className={cn("text-sm mt-2", isDark ? "text-gray-400" : "text-gray-600")}>
                This will remove all {items.reduce((s, i) => s + i.quantity, 0)} items from your order. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 p-6">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className={cn(
                  "flex-1 rounded-lg sm:rounded-xl px-4 py-3 font-medium transition-colors kiosk-tap",
                  isDark
                    ? "bg-zinc-800 text-white hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  useCartStore.getState().clearCart();
                  setShowClearConfirm(false);
                }}
                className="flex-1 rounded-lg sm:rounded-xl px-4 py-3 font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors kiosk-tap"
              >
                Yes, Empty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to home confirmation modal */}
      {showHomeConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
          <div
            className="absolute inset-0 bg-black/50 pointer-events-auto"
            onClick={() => setShowHomeConfirm(false)}
            aria-hidden
          />
          <div
            className={cn(
              "relative w-full max-w-sm rounded-[18px] overflow-hidden shadow-xl pointer-events-auto",
              isDark ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-gray-100"
            )}
          >
            <div className={cn("p-6", isDark ? "border-b border-zinc-700" : "border-b border-gray-100")}>
              <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                Go Back to Home?
              </h3>
              <p className={cn("text-sm mt-2", isDark ? "text-gray-400" : "text-gray-600")}>
                Your current order with {items.reduce((s, i) => s + i.quantity, 0)} items will be cleared. Continue?
              </p>
            </div>
            <div className="flex gap-3 p-6">
              <button
                type="button"
                onClick={() => setShowHomeConfirm(false)}
                className={cn(
                  "flex-1 rounded-lg sm:rounded-xl px-4 py-3 font-medium transition-colors kiosk-tap",
                  isDark
                    ? "bg-zinc-800 text-white hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBackToHome}
                className="flex-1 rounded-lg sm:rounded-xl px-4 py-3 font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors kiosk-tap"
              >
                Yes, Go Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customization modal - centered on page */}
      {customizingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
          <div
            className="absolute inset-0 bg-black/50 pointer-events-auto"
            onClick={() => setCustomizingItem(null)}
            aria-hidden
          />
          <div
            className={cn(
              "relative w-full max-w-md max-h-[90vh] flex flex-col rounded-[18px] overflow-hidden shadow-xl pointer-events-auto",
              isDark ? "bg-zinc-900 border border-zinc-700" : "bg-white border border-gray-100"
            )}
          >
            {/* Header - burger icon with light orange bg + orange outline */}
            <div className={cn("flex items-center justify-between p-5 shrink-0", isDark ? "border-b border-zinc-700" : "border-b border-gray-100")}>
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border-2",
                    isDark ? "bg-zinc-800 border-orange-500" : "bg-[#FFECD7] border-[#FF9F43]"
                  )}
                >
                  <Image src="/assets/images/burger.svg" alt="" width={24} height={24} />
                </div>
                <div className="min-w-0">
                  <h3 className={cn("font-bold text-lg truncate", isDark ? "text-white" : "text-gray-900")}>Your Order</h3>
                  <p className={cn("text-sm truncate", isDark ? "text-gray-400" : "text-gray-500")}>{orderLabel} • {orderId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCustomizingItem(null)}
                className={cn("p-2.5 rounded-xl kiosk-tap shrink-0", isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-600")}
                aria-label="Close"
              >
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - vertical size options, matching reference */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
              <div>
                <p className={cn("font-bold text-base mb-3", isDark ? "text-white" : "text-gray-900")}>Pick Your Size</p>
                <div className="space-y-2">
                  {(["Small", "Medium"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSizeOption(size)}
                      className={cn(
                        "w-full flex justify-between items-center rounded-xl px-4 py-4 kiosk-tap text-left text-base transition-colors border",
                        sizeOption === size
                          ? isDark
                            ? "bg-orange-500 border-orange-400 text-white"
                            : "bg-[#FFF8F1] border-2 border-[#FF9F43]"
                          : isDark
                            ? "bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700"
                            : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm"
                      )}
                    >
                      <span className={cn("font-medium", sizeOption === size && !isDark && "text-gray-900")}>{size}</span>
                      <span className={cn("font-medium", sizeOption === size ? (isDark ? "text-white" : "text-gray-600") : "text-gray-500")}>₹99</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={cn("font-bold text-base mb-3", isDark ? "text-white" : "text-gray-900")}>Level Up (Add Ons)</p>
                <div className="space-y-2">
                  {ADDONS.map((addon) => {
                    const isSelected = selectedAddons.some((a) => a.name === addon.name);
                    return (
                      <button
                        key={addon.name}
                        type="button"
                        onClick={() => toggleAddon(addon)}
                        className={cn(
                          "w-full flex justify-between items-center rounded-xl px-4 py-4 kiosk-tap text-left text-base transition-colors border",
                          isSelected
                            ? isDark
                              ? "bg-orange-500 border-orange-400 text-white"
                              : "bg-[#FFF8F1] border-2 border-[#FF9F43]"
                            : isDark
                              ? "bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700"
                              : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm"
                        )}
                      >
                        <span className={cn("font-medium", isSelected && !isDark && "text-gray-900")}>{addon.name}</span>
                        <span className={cn("font-medium", isSelected ? (isDark ? "text-white" : "text-gray-600") : "text-gray-500")}>+₹{addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer: price left, quantity [+][1][-], Add Item right */}
            <div className={cn("shrink-0 p-5 border-t", isDark ? "border-zinc-700 bg-zinc-900" : "border-gray-100 bg-white")}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>₹{customizeUnitPrice.toFixed(2)}</span>
                  <div className="flex rounded-xl overflow-hidden border-2 border-orange-500">
                    <button
                      type="button"
                      className="bg-[#FF9F43] text-white p-2.5 kiosk-tap hover:opacity-90"
                      onClick={() => setCustomizeQty((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <span className={cn("min-w-[2.5rem] px-3 py-2.5 flex items-center justify-center font-bold text-base border-x border-orange-500/40", isDark ? "bg-zinc-800 text-white" : "bg-white text-gray-900")}>
                      {customizeQty}
                    </span>
                    <button
                      type="button"
                      className="bg-[#FF9F43] text-white p-2.5 kiosk-tap hover:opacity-90 disabled:opacity-50"
                      onClick={() => setCustomizeQty((q) => Math.max(1, q - 1))}
                      disabled={customizeQty <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddToOrder}
                  className="rounded-xl bg-[#FF9F43] px-6 py-3.5 font-semibold text-base text-white hover:opacity-90 kiosk-tap whitespace-nowrap"
                >
                  Add Item | ₹{customizeTotal.toFixed(0)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
