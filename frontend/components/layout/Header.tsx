"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { authApi } from "@/lib/api";

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, clearAuth, accessToken } = useAuthStore();
  const { count, fetchCart, clear }      = useCartStore();
  const [menuOpen, setMenuOpen]  = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const cartCount = count();

  useEffect(() => { if (accessToken) fetchCart(); }, [accessToken]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuOpen && !(e.target as Element).closest("[data-user-menu]")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  async function handleLogout() {
    const rt = localStorage.getItem("refreshToken");
    if (rt) { try { await authApi.logout(rt); } catch {} }
    clearAuth(); clear(); router.push("/");
  }

  const navLinks = [
    { href: "/catalog",               label: "Каталог" },
    { href: "/catalog?brand=apple",   label: "Apple" },
    { href: "/catalog?brand=samsung", label: "Samsung" },
    { href: "/catalog?brand=sony",    label: "Sony" },
  ];

  const headerBg = scrolled
    ? "bg-white/95 backdrop-blur-xl border-b border-[#E4E4E7] shadow-sm"
    : "bg-white border-b border-[#E4E4E7]";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${headerBg}`} style={{ fontFamily: "var(--font-body)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[58px] flex items-center justify-between gap-6">

        {/* Лого */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-[#111110] rounded-lg flex items-center justify-center text-white font-bold text-[11px] tracking-tight flex-shrink-0">
            TS
          </div>
          <span className="font-semibold text-[15px] text-[#111110] tracking-tight">TechStore</span>
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map(link => {
            const active = link.href === "/catalog"
              ? pathname === "/catalog"
              : pathname === "/catalog" && link.href.includes("brand");
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-[#111110] text-white"
                    : "text-[#52525B] hover:text-[#111110] hover:bg-[#F5F5F2]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Действия справа */}
        <div className="flex items-center gap-1">
          {/* Поиск */}
          <Link href="/catalog" title="Поиск"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#111110] hover:bg-[#F5F5F2] transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>

          {/* Корзина */}
          <Link href="/cart" title="Корзина"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#111110] hover:bg-[#F5F5F2] transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-[3px] bg-[#111110] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Авторизация */}
          {user ? (
            <div className="relative ml-1" data-user-menu>
              <button onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F2] transition-colors"
              >
                <span className="w-6 h-6 bg-[#111110] text-white text-[10px] font-bold rounded-full flex items-center justify-center uppercase flex-shrink-0">
                  {user.name[0]}
                </span>
                <span className="text-sm font-medium text-[#111110] hidden sm:block max-w-[80px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#71717A]">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-52 bg-white border border-[#E4E4E7] rounded-2xl shadow-xl shadow-black/8 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-[#F5F5F2] mb-1">
                    <p className="text-sm font-semibold text-[#111110] truncate">{user.name}</p>
                    <p className="text-xs text-[#71717A] truncate mt-0.5">{user.email}</p>
                  </div>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#111110] hover:bg-[#F5F5F2] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    Мой кабинет
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#111110] hover:bg-[#F5F5F2] transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Панель admin
                    </Link>
                  )}
                  <div className="border-t border-[#F5F5F2] mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="ml-1 px-4 py-2 bg-[#111110] text-white text-sm font-semibold rounded-lg hover:bg-[#3F3F46] transition-colors"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
