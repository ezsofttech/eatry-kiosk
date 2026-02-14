"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setResolved } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark: boolean) => {
      root.classList.toggle("dark", isDark);
      setResolved(isDark ? "dark" : "light");
    };

    if (theme === "system") {
      apply(media.matches);
      media.addEventListener("change", (e) => apply(e.matches));
      return () => media.removeEventListener("change", (e) => apply(e.matches));
    }
    apply(theme === "dark");
  }, [theme, setResolved]);

  return <>{children}</>;
}
