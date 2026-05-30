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

// Brand color palettes for no-image cards
const BRAND_STYLES: Record<string, { bg: string; text: string; initial: string }> = {
  apple:   { bg: "linear-gradient(135deg,#1c1c1e 0%,#3a3a3c 100%)", text: "rgba(255,255,255,0.7)", initial: "A" },
  samsung: { bg: "linear-gradient(135deg,#0b2c6b 0%,#1428a0 100%)", text: "rgba(255,255,255,0.7)", initial: "S" },
  sony:    { bg: "linear-gradient(135deg,#0d0d0d 0%,#2a2a2a 100%)", text: "rgba(255,255,255,0.6)", initial: "S" },
  google:  { bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", text: "rgba(255,255,255,0.7)", initial: "G" },
  xiaomi:  { bg: "linear-gradient(135deg,#cc4400 0%,#ff6900 100%)", text: "rgba(255,255,255,0.8)", initial: "X" },
};

export function ProductCard({ product }: { product: Product }) {
  const router     = useRouter();
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

  const imageUrl  = getImageUrl(product.images[0]);
  const noImage   = isPlaceholder(product.images[0]);
  const isOOS     = product.stock === 0;
  const lowStock  = !isOOS && product.stock <= 5;
  const slug      = product.brand.slug;
  const style     = BRAND_STYLES[slug] ?? { bg: "linear-gradient(135deg,#2a2a28 0%,#3a3a38 100%)", text: "rgba(255,255,255,0.6)", initial: product.brand.name[0] };

  return (
    <Link href={`/catalog/${product.slug}`}
      className="group block card-hover rounded-2xl bg-white border border-[#e8e8e4] overflow-hidden">

      {/* Image area */}
      <div className="relative aspect-square overflow-hidden">
        {noImage ? (
          /* CSS-only brand placeholder — no SVG */
          <div
            className="absolute inset-0 flex flex-col items-end justify-end p-5"
            style={{ background: style.bg }}
          >
            {/* Large brand initial */}
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold leading-none select-none"
              style={{
                fontSize: "120px",
                color: "rgba(255,255,255,0.06)",
                letterSpacing: "-4px",
              }}
            >
              {style.initial}
            </span>
            {/* Brand name bottom-left */}
            <div className="absolute bottom-4 left-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: style.text }}>
                {product.brand.name}
              </p>
            </div>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-400 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Out of stock */}
        {isOOS && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[11px] font-semibold text-[#6b6b68] bg-white border border-[#e8e8e4] px-3 py-1 rounded-full shadow-sm">
              Нет в наличии
            </span>
          </div>
        )}

        {/* Add to cart */}
        {!isOOS && (
          <button
            onClick={handleAdd}
            disabled={adding}
            title="В корзину"
            className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-[#111110] hover:bg-[#2a2a28] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 disabled:opacity-60"
          >
            {adding ? (
              <span className="w-3 h-3 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[10px] font-bold text-[#6b6b68] uppercase tracking-widest mb-1">
          {product.brand.name}
        </p>
        <p className="text-[13.5px] font-medium text-[#111110] leading-snug line-clamp-2 mb-3 min-h-[2.6em] group-hover:text-[#2a2a28] transition-colors">
          {product.name}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-[16px] font-semibold text-[#111110] tabular-nums">
            {formatPrice(product.price)}
          </p>
          {lowStock && (
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              {product.stock} шт.
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
