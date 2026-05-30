import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(Number(price));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function getImageUrl(path: string): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  const api = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000";
  return `${api}${path}`;
}

/** Returns true when the resolved URL points to placeholder */
export function isPlaceholder(path: string): boolean {
  return !path || path.includes("placeholder");
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING:   "Ожидает",
  CONFIRMED: "Подтверждён",
  SHIPPED:   "В пути",
  DELIVERED: "Доставлен",
  CANCELLED: "Отменён",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING:   "#71717a",
  CONFIRMED: "#2563eb",
  SHIPPED:   "#f59e0b",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

/** Brand → gradient pair for placeholder cards */
export const BRAND_GRADIENTS: Record<string, string> = {
  apple:   "from-slate-100 to-slate-200",
  samsung: "from-blue-50  to-indigo-100",
  sony:    "from-zinc-100 to-zinc-200",
  google:  "from-red-50   to-orange-100",
  xiaomi:  "from-orange-50 to-amber-100",
};

export const CATEGORY_ICONS: Record<string, string> = {
  smartphones: "📱",
  laptops:     "💻",
  tablets:     "⬜",
  headphones:  "🎧",
  watches:     "⌚",
};
