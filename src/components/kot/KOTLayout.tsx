"use client";

import { useThemeStore } from "@/stores/useThemeStore";
import { cn } from "@/lib/utils";

export function KOTLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";

  return (
    <div
      className={cn(
        "min-h-screen relative",
        isDark ? "text-white" : "text-gray-900",
        className
      )}
      style={{
        backgroundColor: isDark ? "#000000" : "#F5F5F5",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <img
          src="/assets/images/bg-screen.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            opacity: isDark ? 0.95 : 1,
            filter: isDark ? "invert(1) hue-rotate(180deg)" : "none",
          }}
          draggable={false}
          fetchPriority="high"
        />
      </div>
      <main className="relative z-10">{children}</main>
    </div>
  );
}
