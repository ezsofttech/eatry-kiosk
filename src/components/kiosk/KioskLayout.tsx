"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useKioskStore } from "@/stores/useKioskStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { KioskOverlayProvider, useKioskOverlay } from "@/contexts/KioskOverlayContext";
import { cn } from "@/lib/utils";

function HeaderIcons() {
  const { language, setLanguage } = useKioskStore();
  const { setTheme, resolved } = useThemeStore();
  const { overlayOpen } = useKioskOverlay();
  const isDark = resolved === "dark";

  if (overlayOpen) return null;

  return (
    <header className="fixed top-0 right-0 z-50 flex items-center gap-3 p-4">
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "p-2 transition-colors kiosk-tap",
        )}
        aria-label={isDark ? "Light mode" : "Dark mode"}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-3xl border-2 transition-colors kiosk-tap",
          isDark ? "border-zinc-500 hover:bg-white/10" : "border-gray-300 hover:bg-gray-200"
        )}
        onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="font-medium">{language}</span>
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </header>
  );
}

const FOOTER_PATHS = ["/", "/order-type"];

function KioskLayoutInner({
  children,
  showLanguage = true,
  className,
}: {
  children: React.ReactNode;
  showLanguage?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";
  const showFooter = FOOTER_PATHS.includes(pathname || "/");
  const isMenuPage = pathname === "/menu";

  return (
    <div
      className={cn(
        "min-h-screen relative",
        isMenuPage ? "h-screen overflow-hidden" : "overflow-auto",
        isDark ? "text-white" : "text-gray-900",
        className
      )}
      style={{
        backgroundColor: isDark ? "#000000" : "#F5F5F5",
      }}
    >
      {/* Background image: use img so it always renders; in dark mode invert so it's visible on black */}
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
            filter: isDark ? "invert(1) hue-rotate(180deg)" : "none", /* invert so dark SVG shows on #000; hue-rotate keeps colors natural */
          }}
          draggable={false}
          fetchPriority="high"
        />
      </div>
      {showLanguage && <HeaderIcons />}
      <main className="relative z-10">{children}</main>
      {showFooter && (
        <footer className="relative z-10 flex flex-col items-center justify-center gap-2">
          <Image src="/assets/images/logo.svg" alt="Eatry Cloud" width={48} height={48} />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Eatry Cloud</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Version 2.0 • All rights reserved
          </p>
        </footer>
      )}
    </div>
  );
}

export function KioskLayout({
  children,
  showLanguage = true,
  className,
}: {
  children: React.ReactNode;
  showLanguage?: boolean;
  className?: string;
}) {
  return (
    <KioskOverlayProvider>
      <KioskLayoutInner showLanguage={showLanguage} className={className}>
        {children}
      </KioskLayoutInner>
    </KioskOverlayProvider>
  );
}
