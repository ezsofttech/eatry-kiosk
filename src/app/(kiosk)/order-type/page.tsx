"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "next-localization";
import { useKioskStore } from "@/stores/useKioskStore";
import { useCartStore } from "@/stores/useCartStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";

export default function OrderTypePage() {
  const i18n = useI18n();
  const { setOrderType } = useKioskStore();
  const { setOrderType: setCartOrderType, setTableNumber, clearCart } = useCartStore();
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";
  const cardClass = isDark
    ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
    : "bg-zinc-200 hover:bg-zinc-300 border-zinc-300";

  const handleSelect = (type: "dine-in" | "takeaway") => {
    setOrderType(type);
    setCartOrderType(type);
    if (type === "takeaway") setTableNumber(undefined);
    clearCart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] px-3 sm:px-4 pt-10 sm:pt-14 laptop:pt-16">
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
        <span className="text-xs sm:text-sm font-medium tracking-widest text-gray-500 dark:text-gray-400">
          {i18n.t("tagline")}
        </span>
      </div>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 max-w-2xl px-2">
        {i18n.t("orderTypeTitle")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-2xl mb-6 sm:mb-8 px-2">
        <Link
          href="/menu"
          onClick={() => handleSelect("dine-in")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 p-6 sm:p-8 transition-colors kiosk-tap",
            cardClass
          )}
        >
          <Image
            src="/assets/images/dine-in.svg"
            alt="Dine in"
            width={80}
            height={80}
            className="mb-3 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          />
          <span className="text-lg sm:text-2xl font-bold">{i18n.t("dineIn")}</span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">{i18n.t("dineInDesc")}</span>
        </Link>
        <Link
          href="/menu"
          onClick={() => handleSelect("takeaway")}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl border-2 p-6 sm:p-8 transition-colors kiosk-tap",
            cardClass
          )}
        >
          <Image
            src="/assets/images/takeaway.svg"
            alt="Take away"
            width={80}
            height={80}
            className="mb-3 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          />
          <span className="text-lg sm:text-2xl font-bold">{i18n.t("takeaway")}</span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">{i18n.t("takeawayDesc")}</span>
        </Link>
      </div>
      <Link
        href="/"
        className={cn(
          "rounded-3xl px-6 sm:px-8 py-2.5 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base",
          cardClass
        )}
      >
        {i18n.t("cancel")}
      </Link>
    </div>
  );
}
