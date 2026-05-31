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
    return (await res.json()).items ?? [];
  } catch { return []; }
}

const brands = [
  { name: "Apple", slug: "apple" },
  { name: "Samsung", slug: "samsung" },
  { name: "Sony", slug: "sony" },
  { name: "Google", slug: "google" },
  { name: "Xiaomi", slug: "xiaomi" },
];

const categories = [
  { name: "Смартфоны",  slug: "smartphones", desc: "iPhone, Galaxy, Pixel",      icon: "📱" },
  { name: "Ноутбуки",   slug: "laptops",     desc: "MacBook, Galaxy Book",        icon: "💻" },
  { name: "Планшеты",   slug: "tablets",     desc: "iPad, Galaxy Tab",            icon: "🖥" },
  { name: "Наушники",   slug: "headphones",  desc: "AirPods, WH-1000XM5",        icon: "🎧" },
  { name: "Смарт-часы", slug: "watches",     desc: "Apple Watch, Galaxy Watch",   icon: "⌚" },
];

const perks = [
  { stat: "100%",  unit: "оригинал",       desc: "Прямые поставки от официальных дистрибьюторов" },
  { stat: "1–3",   unit: "дня доставки",   desc: "Отправка в день заказа по всей России" },
  { stat: "1 год", unit: "гарантия",       desc: "Официальная гарантия производителя" },
  { stat: "14",    unit: "дней на возврат", desc: "Простой возврат без лишних вопросов" },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ═══ HERO ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#111110]">
          {/* фоновые градиенты */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-white opacity-[0.03] blur-[100px]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white opacity-[0.02] blur-[80px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-6 fade-up">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-white/50 text-xs font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                Оригинальная техника
              </span>
            </div>

            {/* Headline — Montserrat Bold, без курсива */}
            <h1
              className="font-display font-bold text-white mb-6 fade-up delay-1"
              style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
            >
              Технологии,<br />
              которым доверяют
            </h1>

            {/* Subtext */}
            <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-md fade-up delay-2" style={{ fontFamily: "var(--font-body)" }}>
              Apple, Samsung, Sony и другие топовые бренды.<br />
              Только оригинал — с гарантией производителя и доставкой 1–3 дня.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap fade-up delay-3">
              <Link href="/catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#111110] font-semibold text-base rounded-xl hover:bg-[#F5F5F2] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Открыть каталог
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
              <Link href="/catalog?brand=apple"
                className="inline-flex items-center px-7 py-3.5 border border-white/20 text-white/70 font-semibold text-base rounded-xl hover:border-white/35 hover:text-white/90 transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Новинки Apple
              </Link>
            </div>

            {/* Статистика */}
            <div className="flex items-end gap-10 mt-16 fade-up delay-4">
              {[["20+","товаров"],["5","брендов"],["1–3","дня доставки"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display font-bold text-white leading-none" style={{ fontSize: 28 }}>{n}</p>
                  <p className="text-white/40 text-xs uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-body)" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ БРЕНДЫ ══════════════════════════════════════════ */}
        <section className="border-b border-[#E4E4E7] bg-white py-5 px-5">
          <div className="max-w-5xl mx-auto flex items-center justify-center flex-wrap gap-2">
            {brands.map(b => (
              <Link key={b.slug} href={`/catalog?brand=${b.slug}`}
                className="px-5 py-2 rounded-xl border border-[#E4E4E7] bg-white hover:border-[#111110] hover:bg-[#111110] hover:text-white text-sm font-medium text-[#52525B] transition-all duration-150"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ ПРЕИМУЩЕСТВА ════════════════════════════════════ */}
        <section className="bg-white border-b border-[#E4E4E7] py-10 px-5">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E4E4E7] border border-[#E4E4E7] rounded-2xl overflow-hidden">
            {perks.map(p => (
              <div key={p.unit} className="px-6 py-5 bg-white">
                {/* Число крупно */}
                <p className="font-display font-bold text-[#111110] leading-none mb-1" style={{ fontSize: 26 }}>
                  {p.stat}
                  <span className="text-base font-semibold text-[#71717A] ml-1.5" style={{ fontFamily: "var(--font-body)" }}>{p.unit}</span>
                </p>
                <p className="text-sm text-[#71717A] leading-snug mt-2" style={{ fontFamily: "var(--font-body)" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ КАТЕГОРИИ ═══════════════════════════════════════ */}
        <section className="py-16 px-5 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="font-display font-bold text-[#111110]" style={{ fontSize: 28 }}>Категории</h2>
              <div className="h-px flex-1 bg-[#E4E4E7]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map(cat => (
                <Link key={cat.slug} href={`/catalog?category=${cat.slug}`}
                  className="group flex flex-col p-5 bg-white border border-[#E4E4E7] rounded-2xl hover:bg-[#111110] transition-all duration-200 card-hover"
                >
                  <span className="text-2xl mb-3 transition-transform duration-200 group-hover:scale-110">{cat.icon}</span>
                  <p className="font-semibold text-[#111110] group-hover:text-white text-base mb-1 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                    {cat.name}
                  </p>
                  <p className="text-sm text-[#71717A] group-hover:text-white/50 transition-colors leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                    {cat.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ НОВИНКИ ══════════════════════════════════════════ */}
        {products.length > 0 && (
          <section className="py-16 px-5 bg-white border-y border-[#E4E4E7]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-4 mb-8">
                <h2 className="font-display font-bold text-[#111110]" style={{ fontSize: 28 }}>Новинки</h2>
                <Link href="/catalog"
                  className="text-sm font-semibold text-[#52525B] hover:text-[#111110] transition-colors flex items-center gap-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
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

        {/* ═══ БАННЕР ═══════════════════════════════════════════ */}
        <section className="py-20 px-5 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#111110] px-8 md:px-14 py-14 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Гарантия качества
                </div>
                <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.15 }}>
                  Только оригинальные товары
                </h2>
                <p className="text-white/50 text-base leading-relaxed mb-8 max-w-sm" style={{ fontFamily: "var(--font-body)" }}>
                  Работаем напрямую с Apple, Samsung и Sony. Каждый товар поставляется с официальной гарантией производителя.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111110] font-semibold text-sm rounded-xl hover:bg-[#F5F5F2] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Смотреть каталог
                  </Link>
                  <Link href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white/60 font-semibold text-sm rounded-xl hover:border-white/25 hover:text-white/80 transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Создать аккаунт
                  </Link>
                </div>
              </div>
              {/* Декор */}
              <div className="hidden lg:flex items-center justify-center opacity-5 select-none">
                <span className="font-display font-black text-white" style={{ fontSize: 160, lineHeight: 1, letterSpacing: "-0.05em" }}>TS</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
