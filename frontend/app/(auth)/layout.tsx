import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* Левая тёмная панель */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[500px] flex-col justify-between bg-[#111110] p-12 relative overflow-hidden flex-shrink-0">
        {/* Фоновые элементы */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[280px] h-[280px] rounded-full bg-white opacity-[0.03] blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[240px] h-[240px] rounded-full bg-white opacity-[0.02] blur-[70px]" />
        </div>

        {/* Лого */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[#111110] text-[11px] font-bold">TS</div>
          <span className="font-semibold text-base text-white">TechStore</span>
        </Link>

        {/* Контент */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-6 bg-white/20" />
              <span className="text-white/30 text-xs font-semibold tracking-[0.15em] uppercase">Оригинальная техника</span>
            </div>
            {/* Заголовок — Montserrat, без курсива кириллицы */}
            <h2 className="font-display font-bold text-white leading-[1.1] mb-3" style={{ fontSize: 28, letterSpacing: "-0.02em" }}>
              Технологии,<br />которым доверяют
            </h2>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs">
              Apple, Samsung, Sony, Google и Xiaomi — всё оригинальное с официальной гарантией производителя.
            </p>
          </div>

          <ul className="space-y-3">
            {["Гарантия подлинности", "Доставка 1–3 дня", "Официальная гарантия 1 год"].map(t => (
              <li key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-sm text-white/35">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/20 relative z-10">2024 TechStore. Все права защищены.</p>
      </div>

      {/* Правая панель с формой */}
      <div className="flex-1 flex flex-col">
        {/* Мобильная шапка */}
        <div className="lg:hidden flex items-center px-5 h-14 border-b border-[#E4E4E7] bg-[#FAFAF8]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#111110] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">TS</div>
            <span className="font-semibold text-[15px] text-[#111110]">TechStore</span>
          </Link>
        </div>
        <main className="flex-1 flex items-center justify-center p-6 bg-[#FAFAF8]">
          {children}
        </main>
      </div>
    </div>
  );
}
