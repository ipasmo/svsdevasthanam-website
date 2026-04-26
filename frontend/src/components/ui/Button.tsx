"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "golden";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-poppins font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-saffron text-white hover:bg-saffron-600 focus:ring-saffron-400 shadow-md hover:shadow-lg",
    secondary:
      "border-2 border-saffron text-saffron hover:bg-saffron hover:text-white focus:ring-saffron-400",
    ghost:
      "text-gray-600 hover:text-saffron hover:bg-saffron-50 focus:ring-saffron-400 rounded-lg",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm",
    golden:
      "bg-golden text-rust hover:bg-golden-600 focus:ring-golden-400 shadow-md hover:shadow-lg font-bold",
  };

  const sizes = {
    sm: "text-xs px-4 py-1.5",
    md: "text-sm px-6 py-2.5",
    lg: "text-base px-8 py-3.5",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
