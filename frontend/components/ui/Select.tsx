import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-zinc-800">{label}</label>}
      <select
        className={cn(
          "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none appearance-none cursor-pointer transition-all",
          "bg-white border-zinc-300 text-zinc-900",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          className
        )}
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
