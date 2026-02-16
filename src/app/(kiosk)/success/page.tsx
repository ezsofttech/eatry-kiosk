"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/stores/useKioskStore";
import { useCartStore } from "@/stores/useCartStore";
import { useKitchenStore } from "@/stores/useKitchenStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { Check, Clock, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const { orderId, paymentMethod, resetOrder } = useKioskStore();
  const { items, orderType, tableNumber, clearCart } = useCartStore();
  const { addOrder } = useKitchenStore();
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";
  const sentToKitchen = useRef(false);

  useEffect(() => {
    if (sentToKitchen.current) return;
    if (items.length > 0 && orderId) {
      const displayId = orderId.startsWith("#") ? orderId : `#${orderId}`;
      addOrder({
        orderId: displayId,
        type: orderType === "delivery" ? "takeaway" : orderType,
        tableNumber,
        items: items.map((i) => ({ ...i })),
      });
      sentToKitchen.current = true;
    }
    clearCart();
  }, [items.length, orderId, orderType, tableNumber, addOrder, clearCart]);

  useEffect(() => {
    if (countdown <= 0) {
      resetOrder();
      router.replace("/");
      return;
    }
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown, resetOrder, router]);

  const handleBackHome = () => {
    resetOrder();
    clearCart();
    router.replace("/");
  };

  const now = new Date();
  const dateStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " " + now.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24">
      <div className="rounded-full border-3 sm:border-4 border-yellow-400 p-3 sm:p-4 mb-4 sm:mb-6">
        <Check className="w-10 h-10 sm:w-16 sm:h-16 text-yellow-400" strokeWidth={3} />
      </div>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">
        Order Successfull
      </h1>
      <div
        className={cn(
          "w-full max-w-md rounded-lg sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8",
          isDark ? "bg-zinc-800" : "bg-zinc-200"
        )}
      >
        <p className="text-2xs sm:text-xs text-gray-500 uppercase tracking-wider mb-1">ORDER NUMBER</p>
        <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{orderId || "#201"}</p>
        <hr className="border-zinc-600 mb-3 sm:mb-4" />
        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm">
          <span className="text-gray-500">Date</span>
          <span>{dateStr}</span>
          <span className="text-gray-500">Payment Method</span>
          <span className="capitalize">{paymentMethod || "UPI"}</span>
          <span className="text-gray-500">Payment Reference</span>
          <span className="truncate">{Math.floor(Math.random() * 1e13).toString()}</span>
        </div>
      </div>
      <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Clock className="w-4 h-4 shrink-0" />
        Auto Return to home in <span className="text-orange-500 font-bold">{countdown}s</span>
      </p>
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          handleBackHome();
        }}
        className="flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-orange-500 px-6 sm:px-8 py-3 sm:py-4 font-semibold text-white hover:bg-orange-600 transition-colors kiosk-tap text-sm sm:text-base"
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
        Back to Home
      </Link>
      <div className="mt-4 sm:mt-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
