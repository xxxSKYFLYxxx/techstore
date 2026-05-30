"use client";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading = false, className, children, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const v = {
    primary:   "bg-[#111110] text-[#fafaf8] hover:bg-[#2a2a28]",
    secondary: "bg-[#f5f5f2] text-[#111110] hover:bg-[#edede9]",
    ghost:     "text-[#6b6b68] hover:bg-[#f5f5f2] hover:text-[#111110]",
    danger:    "bg-red-600 text-white hover:bg-red-700",
  };
  const s = {
    sm: "px-3.5 py-1.5 text-[12.5px] gap-1.5",
    md: "px-5 py-2.5 text-[13.5px] gap-2",
    lg: "px-7 py-3 text-[14px] gap-2",
  };
  return (
    <button className={cn(base, v[variant], s[size], className)} disabled={disabled || loading} {...props}>
      {loading
        ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />Загрузка...</span>
        : children}
    </button>
  );
}
