import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-medium text-zinc-800">{label}</label>}
    <input
      ref={ref}
      className={cn(
        "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all",
        "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = "Input";
