"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { formatPrice, getImageUrl, isPlaceholder } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

const BRAND_BG: Record<string, string> = {
  apple:   "linear-gradient(135deg,#1c1c1e 0%,#3a3a3c 100%)",
  samsung: "linear-gradient(135deg,#0b2c6b 0%,#1428a0 100%)",
  sony:    "linear-gradient(135deg,#0d0d0d 0%,#2a2a2a 100%)",
  google:  "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
  xiaomi:  "linear-gradient(135deg,#cc4400 0%,#ff6900 100%)",
};

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { user }    = useAuthStore();
  const [adding,      setAdding]      = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  async function handleAddToCart() {
    if (!user) { router.push("/login"); return; }
    setAdding(true);
    try   { await addItem(product.id, 1); toast.success("Добавлено в корзину"); }
    catch { toast.error("Не удалось добавить"); }
    finally { setAdding(false); }
  }

  const images  = product.images.length > 0 ? product.images.map(getImageUrl) : [];
  const noImg   = product.images.length === 0 || isPlaceholder(product.images[0]);
  const brandBg = BRAND_BG[product.brand.slug] ?? "linear-gradient(135deg,#2a2a28 0%,#3a3a38 100%)";
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;
  const specs   = Object.entries(product.specs ?? {});

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#6b6b68] mb-8 flex-wrap">
        <Link href="/" className="hover:text-[#111110] transition-colors">Главная</Link>
        <span className="text-[#e8e8e4]">/</span>
        <Link href="/catalog" className="hover:text-[#111110] transition-colors">Каталог</Link>
        <span className="text-[#e8e8e4]">/</span>
        <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-[#111110] transition-colors">
          {product.category.name}
        </Link>
        <span className="text-[#e8e8e4]">/</span>
        <span className="text-[#111110] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative rounded-3xl overflow-hidden aspect-square">
            {noImg ? (
              <div className="absolute inset-0 flex items-end p-8" style={{ background: brandBg }}>
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold leading-none select-none"
                  style={{ fontSize: "200px", color: "rgba(255,255,255,0.05)", letterSpacing: "-6px" }}
                >
                  {product.brand.name[0]}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40 mb-1">{product.brand.name}</p>
                  <p className="text-white/60 text-sm font-medium">{product.name}</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#f5f5f2]">
                <Image src={images[activeImage]} alt={product.name} fill
                  className="object-contain p-10" priority />
              </div>
            )}
          </div>
          {!noImg && images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-[#f5f5f2] ${i === activeImage ? "border-[#111110]" : "border-transparent hover:border-[#e8e8e4]"}`}>
                  <div className="relative w-full h-full">
                    <Image src={img} alt="" fill className="object-contain p-2" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Link href={`/catalog?brand=${product.brand.slug}`}
              className="text-[10.5px] font-bold uppercase tracking-widest text-[#6b6b68] hover:text-[#111110] transition-colors">
              {product.brand.name}
            </Link>
            <span className="text-[#e8e8e4]">·</span>
            <Link href={`/catalog?category=${product.category.slug}`}
              className="text-[10.5px] font-medium text-[#6b6b68] hover:text-[#111110] transition-colors">
              {product.category.name}
            </Link>
          </div>

          <h1 className="font-display text-2xl sm:text-[32px] font-bold text-[#111110] tracking-tight leading-[1.15] mb-5">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-display text-[40px] font-bold text-[#111110] tabular-nums leading-none">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-7">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${inStock ? "bg-emerald-500" : "bg-[#e8e8e4]"}`} />
            {inStock ? (
              <span className="text-[13px] text-[#6b6b68]">
                {lowStock
                  ? <span className="text-amber-700 font-medium">Осталось {product.stock} шт.</span>
                  : `В наличии · ${product.stock} шт.`}
              </span>
            ) : (
              <span className="text-[13px] text-[#6b6b68]">Нет в наличии</span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 mb-8">
            <Button size="lg" onClick={handleAddToCart} loading={adding} disabled={!inStock}
              className="w-full rounded-2xl bg-[#111110] hover:bg-[#2a2a28] text-[#fafaf8] border-0">
              {!inStock ? "Нет в наличии" : "Добавить в корзину"}
            </Button>
            {user && inStock && (
              <Link href="/cart" className="w-full">
                <Button size="lg" variant="secondary" className="w-full rounded-2xl bg-[#f5f5f2] text-[#111110] hover:bg-[#edede9] border-0">
                  Перейти в корзину
                </Button>
              </Link>
            )}
            {!user && (
              <p className="text-[12px] text-[#6b6b68] text-center">
                <Link href="/login" className="text-[#111110] font-semibold hover:underline">Войдите</Link>, чтобы добавить в корзину
              </p>
            )}
          </div>

          {product.description && (
            <p className="text-[13.5px] text-[#6b6b68] leading-relaxed mb-8 pb-8 border-b border-[#e8e8e4]">
              {product.description}
            </p>
          )}

          {specs.length > 0 && (
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#6b6b68] mb-4">Характеристики</p>
              <div className="space-y-0">
                {specs.map(([key, value], i) => (
                  <div key={key}
                    className={`flex items-start justify-between gap-4 py-2.5 ${i !== specs.length - 1 ? "border-b border-[#f0f0ec]" : ""}`}>
                    <span className="text-[13px] text-[#6b6b68] flex-shrink-0 w-[45%]">{key}</span>
                    <span className="text-[13px] text-[#111110] font-medium text-right flex-1">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
