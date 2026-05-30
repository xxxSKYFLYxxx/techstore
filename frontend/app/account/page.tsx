"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const STATUS_BG: Record<string, string> = {
  PENDING:   "bg-zinc-100 text-zinc-600",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED:   "bg-amber-50 text-amber-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function AccountPage() {
  const { user } = useAuthStore();
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    ordersApi.getMy()
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="text-center">
            <p className="text-xl font-bold text-zinc-900 mb-4">Войдите в аккаунт</p>
            <Link href="/login" className="text-blue-600 hover:underline text-[14px] font-medium">Войти</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-8 py-10">

        {/* Profile card */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 text-white text-lg font-bold rounded-full flex items-center justify-center uppercase flex-shrink-0">
              {user.name[0]}
            </div>
            <div>
              <p className="font-semibold text-zinc-900">{user.name}</p>
              <p className="text-[13px] text-zinc-400">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-[12.5px] font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3.5 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Панель admin
              </Link>
            )}
            <Link
              href="/catalog"
              className="text-[12.5px] font-semibold text-zinc-600 border border-zinc-200 bg-white px-3.5 py-1.5 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              В каталог
            </Link>
          </div>
        </div>

        {/* Orders */}
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-zinc-900">Мои заказы</h2>
          {!loading && orders.length > 0 && (
            <span className="text-[12px] font-semibold text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full">
              {orders.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-28 skeleton rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-zinc-100 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <p className="font-semibold text-zinc-700 mb-2">Заказов пока нет</p>
            <p className="text-[13px] text-zinc-400 mb-5">Перейдите в каталог и оформите первый заказ</p>
            <Link
              href="/catalog"
              className="inline-flex px-5 py-2.5 bg-zinc-900 text-white font-semibold text-[13px] rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-zinc-100 rounded-2xl p-5 hover:border-zinc-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[14px] font-bold text-zinc-900">Заказ #{order.id}</p>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BG[order.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <p className="text-[15px] font-bold text-zinc-900 tabular-nums flex-shrink-0">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="space-y-1 mb-3 pl-0.5">
                  {order.items.map(item => (
                    <p key={item.id} className="text-[12.5px] text-zinc-500 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0" />
                      {item.product.name}
                      <span className="text-zinc-400">×{item.quantity}</span>
                      <span className="text-zinc-400">–</span>
                      <span className="font-medium text-zinc-600">{formatPrice(item.price)}</span>
                    </p>
                  ))}
                </div>

                <div className="border-t border-zinc-100 pt-3 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <p className="text-[12px] text-zinc-400 truncate">{order.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
