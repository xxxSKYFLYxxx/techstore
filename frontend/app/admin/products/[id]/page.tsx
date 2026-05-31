"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { productsApi, catalogApi } from "@/lib/api";
import { Category, Brand } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "", stock: "0",
    categoryId: "", brandId: "", images: "", specs: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") { router.push("/"); return; }
    Promise.all([
      catalogApi.getCategories().then((r) => setCategories(r.data)),
      catalogApi.getBrands().then((r) => setBrands(r.data)),
    ]);

    if (!isNew) {
      productsApi.getAll({ limit: 100 }).then((r) => {
        const p = r.data.items.find((p: { id: number }) => p.id === Number(params.id));
        if (p) {
          setForm({
            name: p.name, slug: p.slug, description: p.description,
            price: String(p.price), stock: String(p.stock),
            categoryId: String(p.category.id), brandId: String(p.brand.id),
            images: p.images.join("\n"), specs: JSON.stringify(p.specs, null, 2),
          });
        }
      }).finally(() => setFetching(false));
    }
  }, [user]);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name, slug: form.slug, description: form.description,
        price: Number(form.price), stock: Number(form.stock),
        categoryId: Number(form.categoryId), brandId: Number(form.brandId),
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        specs: form.specs ? JSON.parse(form.specs) : {},
      };
      if (isNew) {
        await productsApi.create(payload);
        toast.success("Товар создан");
      } else {
        await productsApi.update(Number(params.id), payload);
        toast.success("Товар обновлён");
      }
      router.push("/admin");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
          {isNew ? "Новый товар" : "Редактировать товар"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Название" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <Input label="Slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-900 block mb-1.5">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none bg-white text-zinc-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Цена (руб.)" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} required />
            <Input label="Остаток (шт.)" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-900 block mb-1.5">Категория</label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white text-zinc-900 appearance-none cursor-pointer"
              >
                <option value="">Выберите...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-900 block mb-1.5">Бренд</label>
              <select
                value={form.brandId}
                onChange={(e) => set("brandId", e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white text-zinc-900 appearance-none cursor-pointer"
              >
                <option value="">Выберите...</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-900 block mb-1.5">Изображения (URL, по одному на строку)</label>
            <textarea
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none bg-white text-zinc-900"
              placeholder="/uploads/image.jpg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-900 block mb-1.5">Характеристики (JSON)</label>
            <textarea
              value={form.specs}
              onChange={(e) => set("specs", e.target.value)}
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none bg-white text-zinc-900"
              placeholder='{"display": "6.1 OLED", "cpu": "A17 Pro"}'
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Сохранить</Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/admin")}>Отмена</Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
