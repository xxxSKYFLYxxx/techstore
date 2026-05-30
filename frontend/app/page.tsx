import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products?limit=8&sortBy=newest`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return (await res.json()).items;
  } catch { return []; }
}

const brands = [
  { name: "Apple",   slug: "apple" },
  { name: "Samsung", slug: "samsung" },
  { name: "Sony",    slug: "sony" },
  { name: "Google",  slug: "google" },
  { name: "Xiaomi",  slug: "xiaomi" },
];

const categories = [
  { name: "Смартфоны",  slug: "smartphones", desc: "iPhone · Galaxy · Pixel",       icon: "📱" },
  { name: "Ноутбуки",   slug: "laptops",     desc: "MacBook · Galaxy Book",          icon: "💻" },
  { name: "Планшеты",   slug: "tablets",     desc: "iPad · Galaxy Tab",              icon: "⬜" },
  { name: "Наушники",   slug: "headphones",  desc: "AirPods · WH-1000XM5",          icon: "🎧" },
  { name: "Смарт-часы", slug: "watches",     desc: "Apple Watch · Galaxy Watch",     icon: "⌚" },
];

const perks = [
  { n: "100%",  label: "Оригинал",     desc: "Прямые поставки от официальных дистрибьюторов" },
  { n: "1–3",   label: "Дня доставки", desc: "Отправка в день заказа по всей России" },
  { n: "1 год", label: "Гарантия",     desc: "Официальная гарантия производителя" },
  { n: "14",    label: "Дней возврат", desc: "Простой возврат без лишних вопросов" },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#111110] min-h-[520px] flex items-center">
          {/* Subtle grain texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

          {/* Accent glow */}
          <div className="pointer-events-none absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 w-full">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6 fade-up">
                <div className="w-6 h-px bg-[#fafaf8]/30" />
                <span className="text-[#fafaf8]/50 text-[11px] font-semibold tracking-[0.18em] uppercase">
                  Оригинальная техника
                </span>
              </div>

              {/* Headline — serif display */}
              <h1 className="font-display text-5xl sm:text-6xl md:text-[72px] leading-[1.0] font-bold text-[#fafaf8] mb-6 tracking-tight fade-up delay-1">
                Технологии,<br />
                <em className="italic font-normal text-[#fafaf8]/60">которым доверяют</em>
              </h1>

              <p className="text-[#fafaf8]/50 text-[15px] leading-relaxed mb-10 max-w-md fade-up delay-2">
                Apple, Samsung, Sony и другие. Только оригинал —
                с гарантией производителя и доставкой 1–3 дня.
              </p>

              <div className="flex items-center gap-3 flex-wrap fade-up delay-3">
                <Link href="/catalog"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#fafaf8] text-[#111110] text-[13.5px] font-semibold rounded-xl hover:bg-white transition-colors shadow-lg">
                  Открыть каталог
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
                <Link href="/catalog?brand=apple"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#fafaf8]/15 text-[#fafaf8]/70 text-[13.5px] font-semibold rounded-xl hover:border-[#fafaf8]/30 hover:text-[#fafaf8]/90 transition-colors">
                  Новинки Apple
                </Link>
              </div>
            </div>

            {/* Stats — bottom right */}
            <div className="absolute right-8 bottom-10 hidden lg:flex items-end gap-8 fade-up delay-4">
              {[["20+","товаров"],["5","брендов"],["1–3","дня доставки"]].map(([n,l]) => (
                <div key={l} className="text-right">
                  <p className="font-display text-3xl font-bold text-[#fafaf8] leading-none">{n}</p>
                  <p className="text-[11px] text-[#fafaf8]/40 mt-1 uppercase tracking-wider">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BRANDS ════════════════════════════════════════ */}
        <section className="bg-[#fafaf8] border-b border-[#e8e8e4] py-4 px-5">
          <div className="max-w-5xl mx-auto flex items-center justify-center flex-wrap gap-2">
            {brands.map(b => (
              <Link key={b.slug} href={`/catalog?brand=${b.slug}`}
                className="px-5 py-2 rounded-xl border border-[#e8e8e4] bg-white hover:border-[#111110] hover:bg-[#111110] hover:text-[#fafaf8] text-[13px] font-medium text-[#6b6b68] transition-all duration-150">
                {b.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ══ PERKS ═════════════════════════════════════════ */}
        <section className="bg-white border-b border-[#e8e8e4] py-8 px-5">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e8e4]">
            {perks.map(p => (
              <div key={p.label} className="bg-white px-6 py-5">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-display text-2xl font-bold text-[#111110]">{p.n}</span>
                  <span className="text-[12px] font-semibold text-[#6b6b68] uppercase tracking-wide">{p.label}</span>
                </div>
                <p className="text-[12px] text-[#6b6b68] leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CATEGORIES ════════════════════════════════════ */}
        <section className="py-16 px-5 bg-[#fafaf8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline gap-5 mb-8">
              <h2 className="font-display text-[28px] font-bold text-[#111110]">Категории</h2>
              <div className="h-px flex-1 bg-[#e8e8e4]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map(cat => (
                <Link key={cat.slug} href={`/catalog?category=${cat.slug}`}
                  className="group relative p-5 bg-white border border-[#e8e8e4] rounded-2xl hover:bg-[#111110] transition-all duration-250 overflow-hidden card-hover">
                  <div className="text-2xl mb-3 transition-transform duration-200 group-hover:scale-110">{cat.icon}</div>
                  <p className="text-[13.5px] font-semibold text-[#111110] group-hover:text-white mb-0.5 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-[#6b6b68] group-hover:text-white/50 transition-colors leading-snug">
                    {cat.desc}
                  </p>
                  <svg className="absolute bottom-3 right-3 text-[#e8e8e4] group-hover:text-white/30 transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURED PRODUCTS ═════════════════════════════ */}
        {products.length > 0 && (
          <section className="py-16 px-5 bg-white border-y border-[#e8e8e4]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-4 mb-8">
                <h2 className="font-display text-[28px] font-bold text-[#111110]">Новинки</h2>
                <Link href="/catalog"
                  className="text-[13px] font-semibold text-[#6b6b68] hover:text-[#111110] transition-colors flex items-center gap-1">
                  Все товары
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ══ EDITORIAL BANNER ══════════════════════════════ */}
        <section className="py-20 px-5 bg-[#fafaf8]">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#111110]">
              {/* decorative line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left: text */}
                <div className="px-10 py-14 lg:px-14 lg:py-16">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">Гарантия качества</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-[40px] font-bold text-[#fafaf8] leading-[1.1] mb-4">
                    Только<br />
                    <em className="italic font-normal text-[#fafaf8]/50">оригинальные</em><br />
                    товары
                  </h2>
                  <p className="text-[#fafaf8]/40 text-[14px] leading-relaxed mb-8 max-w-sm">
                    Работаем напрямую с Apple, Samsung и Sony.
                    Каждый товар поставляется с официальной гарантией производителя.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/catalog"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#fafaf8] text-[#111110] text-[13px] font-semibold rounded-xl hover:bg-white transition-colors">
                      Смотреть каталог
                    </Link>
                    <Link href="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-[#fafaf8]/15 text-[#fafaf8]/60 text-[13px] font-semibold rounded-xl hover:border-[#fafaf8]/25 transition-colors">
                      Создать аккаунт
                    </Link>
                  </div>
                </div>

                {/* Right: decorative grid */}
                <div className="relative hidden lg:block">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px p-px opacity-10">
                    {Array.from({length:9}).map((_,i) => (
                      <div key={i} className="bg-white/20 rounded" />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-display text-[80px] font-bold text-white/5 leading-none select-none">TS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
