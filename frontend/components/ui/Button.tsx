"use client";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary", size = "md", loading = false,
  className, children, disabled, ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const v = {
    primary:   "bg-[#111110] text-white hover:bg-[#3F3F46]",
    secondary: "bg-[#F5F5F2] text-[#111110] hover:bg-[#EBEBEA]",
    ghost:     "text-[#52525B] hover:bg-[#F5F5F2] hover:text-[#111110]",
    danger:    "bg-red-600 text-white hover:bg-red-700",
  };

  const s = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2",
  };

  return (
    <button
      className={cn(base, v[variant], s[size], className)}
      style={{ fontFamily: "var(--font-body)" }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Загрузка...
        </span>
      ) : children}
    </button>
  );
}
