"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice, getImageUrl, isPlaceholder, BRAND_GRADIENTS, CATEGORY_ICONS } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, loading, fetchCart, updateItem, removeItem, total } = useCartStore();
  const { user } = useAuthStore();
  const router   = useRouter();

  useEffect(() => { if (user) fetchCart(); }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-28 text-center">
        <div className="text-5xl mb-5">🛒</div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Войдите в аккаунт</h2>
        <p className="text-[14px] text-zinc-500 mb-6">Чтобы увидеть корзину, необходимо авторизоваться</p>
        <Link href="/login" className="inline-flex px-6 py-3 bg-zinc-900 text-white font-semibold text-sm rounded-xl hover:bg-zinc-700 transition-colors">
          Войти
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-10 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white border border-zinc-100 rounded-2xl animate-pulse">
            <div className="w-20 h-20 skeleton rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 skeleton rounded-full w-3/4" />
              <div className="h-3 skeleton rounded-full w-1/2" />
              <div className="h-4 skeleton rounded-full w-1/3 mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-5 py-28 text-center">
        <div className="text-5xl mb-5">🛍</div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Корзина пуста</h2>
        <p className="text-[14px] text-zinc-500 mb-6">Добавьте товары из каталога</p>
        <Link href="/catalog" className="inline-flex px-6 py-3 bg-zinc-900 text-white font-semibold text-sm rounded-xl hover:bg-zinc-700 transition-colors">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  async function handleRemove(id: number) {
    try { await removeItem(id); toast.success("Товар удалён"); }
    catch { toast.error("Ошибка"); }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-8">
        Корзина <span className="text-zinc-400 font-medium text-lg ml-1">({items.length})</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map((item) => {
            const imgSrc  = getImageUrl(item.product.images[0]);
            const noImg   = isPlaceholder(item.product.images[0]);
            const grad    = BRAND_GRADIENTS[item.product.brand.slug] ?? "from-zinc-50 to-zinc-100";
            const catIcon = CATEGORY_ICONS[item.product.category?.slug ?? ""] ?? "📦";

            return (
              <div key={item.id} className="flex gap-4 p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-colors">
                {/* Image */}
                <Link href={`/catalog/${item.product.slug}`} className="flex-shrink-0">
                  <div className={`relative w-20 h-20 rounded-xl overflow-hidden ${noImg ? `bg-gradient-to-br ${grad}` : "bg-zinc-50"}`}>
                    {noImg ? (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">{catIcon}</div>
                    ) : (
                      <Image src={imgSrc} alt={item.product.name} fill className="object-contain p-2" />
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">
                    {item.product.brand.name}
                  </p>
                  <Link href={`/catalog/${item.product.slug}`}>
                    <p className="text-[13.5px] font-medium text-zinc-800 hover:text-blue-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </p>
                  </Link>
                  <p className="text-[14px] font-bold text-zinc-900 mt-1.5 tabular-nums">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Удалить"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-40 font-bold"
                    >
                      −
                    </button>
                    <span className="text-[14px] font-semibold text-zinc-900 w-5 text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-40 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 sticky top-[76px]">
            <h2 className="text-[14px] font-bold text-zinc-900 mb-4">Итого</h2>
            <div className="space-y-2.5 mb-5">
              <div className="flex justify-between text-[13px]">
                <span className="text-zinc-500">Товаров</span>
                <span className="text-zinc-700 font-medium">{items.reduce((s, i) => s + i.quantity, 0)} шт.</span>
              </div>
              <div className="border-t border-zinc-100 pt-2.5 flex justify-between">
                <span className="text-[14px] font-semibold text-zinc-900">Сумма</span>
                <span className="text-[15px] font-bold text-zinc-900 tabular-nums">{formatPrice(total())}</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-[14px] rounded-xl transition-colors"
            >
              Оформить заказ
            </button>
            <Link
              href="/catalog"
              className="block mt-3 text-center text-[12.5px] text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
