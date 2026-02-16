"use client";

import { useEffect } from "react";

/**
 * Prevents the browser context menu (right-click menu) app-wide for kiosk use.
 * Stops the menu from appearing over borders and UI elements.
 */
export function DisableContextMenu() {
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", preventContextMenu);
    return () => document.removeEventListener("contextmenu", preventContextMenu);
  }, []);
  return null;
}
