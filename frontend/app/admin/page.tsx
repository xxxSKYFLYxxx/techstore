"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { productsApi, ordersApi, adminApi } from "@/lib/api";
import { Product, Order } from "@/types";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

type Tab = "products" | "orders" | "users";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string; email: string; role: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "ADMIN") { router.push("/"); return; }
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    setLoading(true);
    const fetchers: Record<Tab, () => Promise<void>> = {
      products: () => productsApi.getAll({ limit: 50 }).then((r) => setProducts(r.data.items)),
      orders: () => ordersApi.getAll({ limit: 50 }).then((r) => setOrders(r.data.items)),
      users: () => adminApi.getUsers({ limit: 50 }).then((r) => setUsers(r.data.items)),
    };
    fetchers[tab]().catch(() => {}).finally(() => setLoading(false));
  }, [tab, user]);

  async function handleDeleteProduct(id: number) {
    if (!confirm("Удалить товар?")) return;
    try {
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Товар удалён");
    } catch {
      toast.error("Ошибка");
    }
  }

  async function handleOrderStatus(id: number, status: string) {
    try {
      await ordersApi.updateStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: status as Order["status"] } : o))
      );
      toast.success("Статус обновлён");
    } catch {
      toast.error("Ошибка");
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: "Товары" },
    { key: "orders", label: "Заказы" },
    { key: "users", label: "Пользователи" },
  ];

  const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">Панель управления</h1>
          <Link href="/admin/products/new">
            <Button size="sm">+ Добавить товар</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-zinc-200 rounded-xl p-1 w-fit mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t.key ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="animate-pulse h-14 bg-white rounded-xl" />)}
          </div>
        ) : (
          <>
            {/* Products */}
            {tab === "products" && (
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-100">
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">ID</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Название</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Бренд</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Цена</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Остаток</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 text-zinc-500">{p.id}</td>
                        <td className="px-4 py-3 text-zinc-900 font-medium max-w-[200px] truncate">
                          <Link href={`/catalog/${p.slug}`} className="hover:text-blue-600">{p.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{p.brand.name}</td>
                        <td className="px-4 py-3 text-zinc-900">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3">
                          <span className={p.stock > 0 ? "text-green-500" : "text-red-500"}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-end">
                          <Link href={`/admin/products/${p.id}`}>
                            <Button size="sm" variant="secondary">Изменить</Button>
                          </Link>
                          <Button size="sm" variant="danger" onClick={() => handleDeleteProduct(p.id)}>
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Orders */}
            {tab === "orders" && (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-zinc-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-zinc-900">Заказ #{order.id}</span>
                        <Badge color={ORDER_STATUS_COLORS[order.status]}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                        <span className="text-xs text-zinc-500">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">{formatPrice(order.total)}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">{order.address}</p>
                    <div className="flex flex-wrap gap-2">
                      {ORDER_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleOrderStatus(order.id, s)}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${order.status === s ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"}`}
                        >
                          {ORDER_STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users */}
            {tab === "users" && (
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-100">
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">ID</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Имя</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Роль</th>
                      <th className="text-left px-4 py-3 font-medium text-zinc-500">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3 text-zinc-500">{u.id}</td>
                        <td className="px-4 py-3 text-zinc-900 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-zinc-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge color={u.role === "ADMIN" ? "#0071e3" : "#6e6e73"}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
