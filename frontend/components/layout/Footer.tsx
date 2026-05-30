import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111110] text-[#fafaf8] mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-[#fafaf8] rounded-lg flex items-center justify-center text-[#111110] text-[10px] font-bold">TS</div>
              <span className="font-semibold text-[15px]">TechStore</span>
            </div>
            <p className="text-[13px] text-[#fafaf8]/40 leading-relaxed max-w-[180px]">
              Оригинальная техника топовых брендов с гарантией производителя.
            </p>
          </div>

          {[
            {
              title: "Каталог",
              links: [
                ["/catalog?category=smartphones", "Смартфоны"],
                ["/catalog?category=laptops",     "Ноутбуки"],
                ["/catalog?category=tablets",     "Планшеты"],
                ["/catalog?category=headphones",  "Наушники"],
                ["/catalog?category=watches",     "Смарт-часы"],
              ]
            },
            {
              title: "Покупателям",
              links: [
                ["/account", "Мои заказы"],
                ["/cart",    "Корзина"],
                ["/login",   "Войти"],
                ["/register","Регистрация"],
              ]
            },
            {
              title: "Контакты",
              links: [] as [string,string][],
              info: ["info@techstore.ru", "+7 (800) 000-00-00", "Пн–Пт, 9:00–20:00"]
            },
          ].map(col => (
            <div key={col.title}>
              <p className="text-[10px] font-bold text-[#fafaf8]/30 uppercase tracking-[0.14em] mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-[13px] text-[#fafaf8]/50 hover:text-[#fafaf8] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
                {col.info?.map(t => (
                  <li key={t} className="text-[13px] text-[#fafaf8]/40">{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#fafaf8]/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#fafaf8]/25">2024 TechStore. Все права защищены.</p>
          <p className="text-[11px] text-[#fafaf8]/25">Все товары оригинальные</p>
        </div>
      </div>
    </footer>
  );
}
