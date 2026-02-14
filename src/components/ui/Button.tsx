"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "kiosk";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500":
              variant === "primary",
            "bg-surface-elevated border border-border hover:bg-surface-muted dark:bg-surface-elevated dark:border-border":
              variant === "secondary",
            "hover:bg-surface-muted dark:hover:bg-surface-elevated": variant === "ghost",
            "border border-border hover:bg-surface-muted dark:border-border dark:hover:bg-surface-elevated":
              variant === "outline",
            "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500":
              variant === "danger",
          },
          {
            "px-2 py-1 text-2xs sm:text-xs": size === "xs",
            "px-3 py-1.5 text-xs sm:text-sm": size === "sm",
            "px-4 py-2 text-sm sm:text-base": size === "md",
            "px-6 py-3 text-base sm:text-lg": size === "lg",
            "px-6 py-4 text-lg min-h-[44px] sm:min-h-[48px] min-w-[44px] sm:min-w-[48px]": size === "kiosk",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
