"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { ordersApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart, total, clear } = useCartStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ address?: string; phone?: string }>({});

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-xl font-semibold text-zinc-900 mb-6">Войдите в аккаунт</p>
        <Link href="/login"><Button className="rounded-full">Войти</Button></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-xl font-semibold text-zinc-900 mb-2">Корзина пуста</p>
        <Link href="/catalog"><Button className="rounded-full mt-4">В каталог</Button></Link>
      </div>
    );
  }

  function validate() {
    const e: { address?: string; phone?: string } = {};
    if (!address.trim()) e.address = "Укажите адрес доставки";
    if (!phone.trim()) e.phone = "Укажите номер телефона";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await ordersApi.create({ address, phone });
      clear();
      toast.success(`Заказ #${data.id} оформлен`);
      router.push("/account");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Ошибка оформления заказа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-8">Оформление заказа</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="bg-zinc-100 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-zinc-900">Данные доставки</h2>
            <Input
              label="Адрес доставки"
              placeholder="Город, улица, дом, квартира"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={errors.address}
            />
            <Input
              label="Телефон"
              placeholder="+7 (999) 000-00-00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
          </div>

          <div className="bg-zinc-100 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-zinc-900 mb-3">Получатель</h2>
            <p className="text-sm text-zinc-500">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full rounded-full">
            Подтвердить заказ
          </Button>
        </form>

        {/* Order summary */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-zinc-100 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-zinc-900 mb-4">Ваш заказ</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-2">
                  <span className="text-sm text-zinc-500 flex-1 line-clamp-1">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-sm font-medium text-zinc-900 flex-shrink-0">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-3 flex justify-between">
              <span className="text-sm font-semibold text-zinc-900">Итого</span>
              <span className="text-sm font-semibold text-zinc-900">{formatPrice(total())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
