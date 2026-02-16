"use client";

import Link from "next/link";
import { useKitchenStore, type KitchenOrder } from "@/stores/useKitchenStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";
import { ChefHat, Check, ArrowLeft, RefreshCw } from "lucide-react";

function OrderTicket({
  order,
  onMarkReady,
  isDark,
}: {
  order: KitchenOrder;
  onMarkReady: () => void;
  isDark: boolean;
}) {
  const time = new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border",
        isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"
      )}
    >
      <div
        className={cn(
          "px-4 py-3 border-b flex items-center justify-between gap-2 min-h-0",
          order.status === "ready"
            ? isDark
              ? "bg-primary-500/20 border-primary-500/30"
              : "bg-primary-500/10 border-primary-200"
            : isDark
              ? "bg-primary-500/15 border-primary-500/30"
              : "bg-primary-500/10 border-primary-200"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-lg truncate">{order.orderId}</span>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
              isDark ? "bg-zinc-700 text-gray-300" : "bg-zinc-200 text-gray-700"
            )}
          >
            {order.type === "dine-in" ? "Dine-in" : "Takeaway"}
            {order.type === "dine-in" && order.tableNumber != null
              ? ` T${order.tableNumber}`
              : ""}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-medium shrink-0",
            isDark ? "text-gray-400" : "text-muted"
          )}
          suppressHydrationWarning
        >
          {time}
        </span>
      </div>
      <div className="p-4 space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex justify-between items-start gap-2 text-sm",
              isDark ? "text-gray-200" : "text-gray-800"
            )}
          >
            <span className="font-medium">
              {item.name}
              {item.quantity > 1 ? ` × ${item.quantity}` : ""}
            </span>
            {item.quantity > 1 && (
              <span
                className={cn(
                  "shrink-0 font-semibold",
                  isDark ? "text-primary-400" : "text-primary-600"
                )}
              >
                {item.quantity}
              </span>
            )}
          </div>
        ))}
      </div>
      {order.status === "preparing" && (
        <div
          className={cn(
            "p-3 border-t border-dashed",
            isDark ? "border-zinc-600" : "border-gray-300"
          )}
        >
          <button
            type="button"
            onClick={onMarkReady}
            className="w-full rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors kiosk-tap bg-primary-500 text-white hover:bg-primary-600"
          >
            <Check className="w-4 h-4" />
            Mark Ready
          </button>
        </div>
      )}
    </div>
  );
}

export default function KOTPage() {
  const { orders, setOrderStatus } = useKitchenStore();

  const handleRefresh = () => {
    window.location.reload();
  };
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";

  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");

  return (
    <div className="flex flex-col min-h-0 h-screen overflow-hidden p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5 shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/pos"
            className={cn(
              "p-2 rounded-xl kiosk-tap transition-colors",
              isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-200"
            )}
            aria-label="Back to POS"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-primary-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Kitchen Order Ticket
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className={cn(
            "p-2 rounded-xl kiosk-tap transition-colors",
            isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-200"
          )}
          aria-label="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 min-h-0 overflow-auto">
        {/* Preparing */}
        <div className="flex flex-col min-h-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 shrink-0 text-primary-600 dark:text-primary-400">
            Preparing ({preparing.length})
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
            {preparing.length === 0 ? (
              <p
                className={cn(
                  "text-sm py-8 text-center rounded-xl border border-dashed text-muted",
                  isDark ? "border-zinc-600" : "border-zinc-300"
                )}
              >
                No orders preparing
              </p>
            ) : (
              preparing.map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onMarkReady={() => setOrderStatus(order.id, "ready")}
                  isDark={isDark}
                />
              ))
            )}
          </div>
        </div>

        {/* Ready */}
        <div className="flex flex-col min-h-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 shrink-0 text-primary-600 dark:text-primary-400">
            Ready ({ready.length})
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
            {ready.length === 0 ? (
              <p
                className={cn(
                  "text-sm py-8 text-center rounded-xl border border-dashed text-muted",
                  isDark ? "border-zinc-600" : "border-zinc-300"
                )}
              >
                No orders ready
              </p>
            ) : (
              ready.map((order) => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onMarkReady={() => {}}
                  isDark={isDark}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
