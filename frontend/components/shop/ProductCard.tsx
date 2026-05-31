"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice, getImageUrl, isPlaceholder } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

const BRAND_STYLES: Record<string, { bg: string; initial: string }> = {
  apple:   { bg: "linear-gradient(135deg,#1C1C1E 0%,#3A3A3C 100%)", initial: "A" },
  samsung: { bg: "linear-gradient(135deg,#0B2C6B 0%,#1428A0 100%)", initial: "S" },
  sony:    { bg: "linear-gradient(135deg,#0D0D0D 0%,#2A2A2A 100%)", initial: "S" },
  google:  { bg: "linear-gradient(135deg,#1A1A2E 0%,#16213E 100%)", initial: "G" },
  xiaomi:  { bg: "linear-gradient(135deg,#CC4400 0%,#FF6900 100%)", initial: "X" },
};

export function ProductCard({ product }: { product: Product }) {
  const router    = useRouter();
  const { addItem }  = useCartStore();
  const { user }     = useAuthStore();
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (!user) { router.push("/login"); return; }
    setAdding(true);
    try   { await addItem(product.id, 1); toast.success("Добавлено в корзину"); }
    catch { toast.error("Не удалось добавить"); }
    finally { setAdding(false); }
  }

  const imageUrl = getImageUrl(product.images[0]);
  const noImage  = isPlaceholder(product.images[0]);
  const isOOS    = product.stock === 0;
  const lowStock = !isOOS && product.stock <= 5;
  const style    = BRAND_STYLES[product.brand.slug] ?? { bg: "linear-gradient(135deg,#2A2A28 0%,#3A3A38 100%)", initial: product.brand.name[0] };

  return (
    <Link href={`/catalog/${product.slug}`}
      className="group block card-hover rounded-2xl bg-white border border-[#E4E4E7] overflow-hidden"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Изображение */}
      <div className="relative aspect-square overflow-hidden">
        {noImage ? (
          <div className="absolute inset-0 flex flex-col items-end justify-end p-4" style={{ background: style.bg }}>
            {/* Большая начальная буква как фон */}
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold leading-none select-none"
              style={{ fontSize: 120, color: "rgba(255,255,255,0.07)", fontFamily: "var(--font-display)", letterSpacing: "-4px" }}
            >
              {style.initial}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                {product.brand.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#F5F5F2]">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-5 transition-transform duration-400 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}

        {/* Нет в наличии */}
        {isOOS && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-sm font-semibold text-[#52525B] bg-white border border-[#E4E4E7] px-3 py-1.5 rounded-full shadow-sm">
              Нет в наличии
            </span>
          </div>
        )}

        {/* Кнопка в корзину */}
        {!isOOS && (
          <button onClick={handleAdd} disabled={adding} title="В корзину"
            className="absolute bottom-3 right-3 w-9 h-9 bg-[#111110] hover:bg-[#3F3F46] text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 disabled:opacity-60"
          >
            {adding
              ? <span className="w-3.5 h-3.5 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            }
          </button>
        )}
      </div>

      {/* Информация */}
      <div className="p-4">
        {/* Бренд */}
        <p className="text-xs font-semibold text-[#71717A] uppercase tracking-[0.12em] mb-1.5">
          {product.brand.name}
        </p>
        {/* Название — 15px через inline style для надёжности */}
        <p
          className="font-medium leading-snug line-clamp-2 mb-3 transition-colors"
          style={{ fontSize: 15, color: 'inherit', minHeight: '2.5em' }}
        >
          {product.name}
        </p>
        {/* Цена — Montserrat bold */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-display font-bold text-lg tabular-nums" style={{ color: '#111110' }}>
            {formatPrice(product.price)}
          </p>
          {lowStock && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              Осталось {product.stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
