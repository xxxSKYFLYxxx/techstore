import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111110] text-white mt-auto" style={{ fontFamily: "var(--font-body)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-[#111110] text-[11px] font-bold">TS</div>
              <span className="font-semibold text-base text-white">TechStore</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-[180px]">
              Оригинальная техника топовых брендов с гарантией производителя.
            </p>
          </div>

          {/* Каталог */}
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-4">Каталог</p>
            <ul className="flex flex-col gap-3">
              {[
                ["/catalog?category=smartphones", "Смартфоны"],
                ["/catalog?category=laptops",     "Ноутбуки"],
                ["/catalog?category=tablets",     "Планшеты"],
                ["/catalog?category=headphones",  "Наушники"],
                ["/catalog?category=watches",     "Смарт-часы"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/45 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Покупателям */}
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-4">Покупателям</p>
            <ul className="flex flex-col gap-3">
              {[
                ["/account",  "Мои заказы"],
                ["/cart",     "Корзина"],
                ["/login",    "Войти"],
                ["/register", "Регистрация"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/45 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] mb-4">Контакты</p>
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-white/45">info@techstore.ru</li>
              <li className="text-sm text-white/45">+7 (800) 000-00-00</li>
              <li className="text-sm text-white/45">Пн–Пт, 9:00–20:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">2024 TechStore. Все права защищены.</p>
          <p className="text-xs text-white/25">Все товары оригинальные</p>
        </div>
      </div>
    </footer>
  );
}
