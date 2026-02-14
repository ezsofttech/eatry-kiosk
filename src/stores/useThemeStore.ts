import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
  setResolved: (resolved: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      resolved: "light",
      setTheme: (theme) => set({ theme }),
      setResolved: (resolved) => set({ resolved }),
    }),
    { name: "kiosk-theme" }
  )
);
