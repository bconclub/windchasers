"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "onDark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  // Gold is the accent, so it belongs on the one action that matters per view.
  primary:
    "bg-gold text-dark-900 shadow-inset hover:bg-gold-400 active:bg-gold-600 disabled:bg-gold-200",
  secondary: "bg-dark text-white hover:bg-dark-700 disabled:bg-dark-300",
  ghost: "bg-surface text-dark-600 border border-line hover:bg-dark-50 hover:text-dark",
  danger: "bg-danger text-white hover:bg-danger-ink",
  // For use on the dark shell, where a light ghost button would disappear.
  onDark: "bg-white/10 text-white hover:bg-white/20 active:bg-white/25",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[0.8125rem]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-feedback ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
});
