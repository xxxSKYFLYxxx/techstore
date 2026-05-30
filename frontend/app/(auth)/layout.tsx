import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left dark panel */}
      <div className="hidden lg:flex lg:w-[460px] xl:w-[520px] flex-col justify-between bg-[#111110] p-12 relative overflow-hidden flex-shrink-0">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)" }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 bg-[#fafaf8] rounded-xl flex items-center justify-center text-[#111110] text-[11px] font-bold">TS</div>
          <span className="text-[#fafaf8] font-semibold text-[15px]">TechStore</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#fafaf8]/20" />
              <span className="text-[#fafaf8]/30 text-[10px] font-bold tracking-widest uppercase">Оригинальная техника</span>
            </div>
            <h2 className="font-display text-[28px] font-bold text-[#fafaf8] leading-[1.1] mb-3">
              Технологии,<br />
              <em className="italic font-normal text-[#fafaf8]/40">которым доверяют</em>
            </h2>
            <p className="text-[13px] text-[#fafaf8]/35 leading-relaxed max-w-xs">
              Apple, Samsung, Sony, Google и Xiaomi — всё оригинальное с официальной гарантией производителя.
            </p>
          </div>
          <div className="space-y-3">
            {["Гарантия подлинности", "Доставка 1–3 дня", "Официальная гарантия 1 год"].map(t => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#fafaf8]/8 flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-[12.5px] text-[#fafaf8]/35">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10.5px] text-[#fafaf8]/20 relative z-10">2024 TechStore. Все права защищены.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center px-5 h-14 border-b border-[#e8e8e4] bg-[#fafaf8]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#111110] rounded-lg flex items-center justify-center text-[#fafaf8] text-[10px] font-bold">TS</div>
            <span className="font-semibold text-[#111110] text-[15px]">TechStore</span>
          </Link>
        </div>
        <main className="flex-1 flex items-center justify-center p-6 bg-[#fafaf8]">
          {children}
        </main>
      </div>
    </div>
  );
}
