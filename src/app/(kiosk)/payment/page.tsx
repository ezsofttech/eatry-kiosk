"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/stores/useKioskStore";
import { useCartStore } from "@/stores/useCartStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { Lock, Server, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentPage() {
  const router = useRouter();
  const { setPaymentMethod, orderId: existingOrderId } = useKioskStore();
  const { getTotal } = useCartStore();
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";
  const total = getTotal(5);

  useEffect(() => {
    if (total <= 0) router.replace("/menu");
  }, [total, router]);

  const handleSelectPayment = (method: "upi" | "counter" | "card") => {
    setPaymentMethod(method);
    router.push("/success");
  };

  const payments = [
    {
      id: "upi" as const,
      label: "UPI (Gpay, Phonepe)",
      icon: "/assets/images/upi.svg",
    },
    {
      id: "counter" as const,
      label: "Pay at Counter",
      icon: "/assets/images/pay-at-counter.svg",
    },
    {
      id: "card" as const,
      label: "Credit/Debit Card",
      icon: "/assets/images/card.svg",
    },
  ];

  if (total <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">
        How would you like to pay?
      </h1>
      <div className="rounded-full bg-amber-700/80 px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold mb-8 sm:mb-10 text-sm sm:text-base">
        Total Amount Due : ₹{total.toFixed(2)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-4xl mb-12 sm:mb-16 px-2">
        {payments.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPayment(p.id)}
            className={cn(
              "flex flex-col items-center rounded-2xl border-2 p-4 sm:p-6 transition-all kiosk-tap",
              isDark
                ? "bg-zinc-800 border-zinc-600 hover:border-orange-500 hover:bg-zinc-700"
                : "bg-white border-zinc-300 hover:border-orange-500 hover:bg-gray-50"
            )}
          >
            <Image 
              src={p.icon} 
              alt={p.label} 
              width={64} 
              height={64} 
              className="mb-2 sm:mb-3 w-12 h-12 sm:w-16 sm:h-16"
            />
            <span className="text-xs sm:text-sm font-medium text-center">{p.label}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 px-2">
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>100% SECURE</span>
        </span>
        <span className="flex items-center gap-2">
          <Server className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>SSL ENCRYPTED</span>
        </span>
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>PCI DSS COMPLIANT</span>
        </span>
      </div>
    </div>
  );
}
