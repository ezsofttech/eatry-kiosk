"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type KioskOverlayContextValue = {
  overlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
};

const KioskOverlayContext = createContext<KioskOverlayContextValue | null>(null);

export function KioskOverlayProvider({ children }: { children: ReactNode }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  return (
    <KioskOverlayContext.Provider value={{ overlayOpen, setOverlayOpen }}>
      {children}
    </KioskOverlayContext.Provider>
  );
}

export function useKioskOverlay() {
  const ctx = useContext(KioskOverlayContext);
  return ctx ?? { overlayOpen: false, setOverlayOpen: (_: boolean) => {} };
}
