"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product, Category, Brand } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest",    label: "Сначала новые" },
  { value: "price_asc", label: "Дешевле" },
  { value: "price_desc",label: "Дороже" },
];

const CAT_ICONS: Record<string, string> = {
  smartphones: "📱", laptops: "💻", tablets: "⬜", headphones: "🎧", watches: "⌚",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function CatalogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products,   setProducts]   = useState<Product[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands,     setBrands]     = useState<Brand[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const page     = searchParams.get("page")     || "1";
  const category = searchParams.get("category") || "";
  const brand    = searchParams.get("brand")    || "";
  const search   = searchParams.get("search")   || "";
  const sortBy   = searchParams.get("sortBy")   || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [localSearch, setLocalSearch] = useState(search);
  const [localMin,    setLocalMin]    = useState(minPrice);
  const [localMax,    setLocalMax]    = useState(maxPrice);

  useEffect(() => {
    fetch(`${API_URL}/categories`).then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API_URL}/brands`).then(r => r.json()).then(d => setBrands(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const p = new URLSearchParams();
    p.set("page",   page);
    p.set("limit",  "12");
    p.set("sortBy", sortBy);
    if (category) p.set("category", category);
    if (brand)    p.set("brand",    brand);
    if (search)   p.set("search",   search);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);

    fetch(`${API_URL}/products?${p.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setProducts(data.items ?? []);
          setTotal(data.total ?? 0);
          setTotalPages(data.totalPages ?? 1);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [page, category, brand, search, sortBy, minPrice, maxPrice]);

  function go(updates: Record<string, string>) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k);
    });
    p.delete("page");
    if (updates.page) p.set("page", updates.page);
    router.push(`/catalog?${p.toString()}`);
  }

  function applyFilters() { go({ search: localSearch, minPrice: localMin, maxPrice: localMax }); setMobileOpen(false); }
  function resetFilters()  { setLocalSearch(""); setLocalMin(""); setLocalMax(""); router.push("/catalog"); setMobileOpen(false); }

  const hasFilters = !!(category || brand || search || minPrice || maxPrice);

  const sidebar = (
    <div className="space-y-6">
      <div>
        <p className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-widest mb-2.5">Поиск</p>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="w-full pl-8 pr-3 py-2 text-[13px] bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-zinc-400"
            placeholder="Название товара..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilters()}
          />
        </div>
      </div>

      <div>
        <p className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-widest mb-2.5">Категория</p>
        <div className="space-y-0.5">
          <button onClick={() => go({ category: "" })}
            className={cn("w-full text-left text-[13px] px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
              !category ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900")}>
            <span>🗂</span> Все категории
          </button>
          {categories.map(c => (
            <button key={c.slug} onClick={() => go({ category: c.slug })}
              className={cn("w-full text-left text-[13px] px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                category === c.slug ? "bg-zinc-900 text-white font-semibold" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900")}>
              <span>{CAT_ICONS[c.slug] ?? "📦"}</span> {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-widest mb-2.5">Бренд</p>
        <div className="flex flex-wrap gap-1.5">
          {[{ slug: "", name: "Все" }, ...brands].map(b => (
            <button key={b.slug} onClick={() => go({ brand: b.slug })}
              className={cn("px-3 py-1 text-[12px] rounded-full border font-medium transition-all",
                (b.slug === "" ? !brand : brand === b.slug)
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 bg-white")}>
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-widest mb-2.5">Цена, ₽</p>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="от" value={localMin} onChange={e => setLocalMin(e.target.value)}
            className="w-full px-3 py-2 text-[13px] bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-zinc-400" />
          <span className="text-zinc-400 flex-shrink-0">–</span>
          <input type="number" placeholder="до" value={localMax} onChange={e => setLocalMax(e.target.value)}
            className="w-full px-3 py-2 text-[13px] bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-blue-500 transition-all placeholder:text-zinc-400" />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={applyFilters}
          className="flex-1 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
          Применить
        </button>
        {hasFilters && (
          <button onClick={resetFilters}
            className="px-4 py-2.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors">
            Сброс
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Каталог</h1>
          {hasFilters && <p className="text-[13px] text-zinc-400 mt-0.5">{loading ? "Поиск..." : `Найдено ${total} товаров`}</p>}
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-xl text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
          Фильтры
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="flex-shrink-0 w-56 hidden lg:block">
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 sticky top-[76px]">{sidebar}</div>
        </aside>

        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <p className="font-semibold text-zinc-900">Фильтры</p>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
              {sidebar}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-5">
            <p className="text-[13px] text-zinc-500">{loading ? "" : `${total} товаров`}</p>
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => go({ sortBy: opt.value })}
                  className={cn("px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all",
                    sortBy === opt.value ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900")}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category && <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 text-[12px] font-medium rounded-full">
                {CAT_ICONS[category]} {categories.find(c => c.slug === category)?.name}
                <button onClick={() => go({ category: "" })}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </span>}
              {brand && <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 text-[12px] font-medium rounded-full">
                {brands.find(b => b.slug === brand)?.name}
                <button onClick={() => go({ brand: "" })}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </span>}
              {search && <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-700 text-[12px] font-medium rounded-full">
                «{search}»
                <button onClick={() => { setLocalSearch(""); go({ search: "" }); }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </span>}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-zinc-100">
                  <div className="aspect-square skeleton" />
                  <div className="p-3.5 space-y-2">
                    <div className="h-2.5 skeleton w-1/3 rounded-full" />
                    <div className="h-3 skeleton w-full rounded-full" />
                    <div className="h-4 skeleton w-1/2 rounded-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-zinc-700 mb-2">Ничего не найдено</p>
              <p className="text-[13px] text-zinc-400 mb-5">Попробуйте изменить фильтры</p>
              <button onClick={resetFilters}
                className="px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-xl hover:bg-zinc-700 transition-colors">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => go({ page: String(p) })}
                      className={cn("w-9 h-9 rounded-xl text-[13px] font-semibold transition-all",
                        p === Number(page) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200")}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-5 sm:px-8 py-8" />}>
      <CatalogPageContent />
    </Suspense>
  );
}
