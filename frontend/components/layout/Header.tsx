"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { authApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, clearAuth, accessToken } = useAuthStore();
  const { count, fetchCart, clear }      = useCartStore();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const cartCount = count();

  useEffect(() => { if (accessToken) fetchCart(); }, [accessToken]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
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
    { href: "/catalog",              label: "Каталог" },
    { href: "/catalog?brand=apple",  label: "Apple" },
    { href: "/catalog?brand=samsung",label: "Samsung" },
    { href: "/catalog?brand=sony",   label: "Sony" },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-[#fafaf8]/95 backdrop-blur-xl border-b border-[#e8e8e4] shadow-sm"
        : "bg-[#fafaf8] border-b border-[#e8e8e4]"
    )}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-7 h-7 bg-[#111110] rounded-lg flex items-center justify-center text-[#fafaf8] text-[10px] font-bold tracking-tight transition-transform group-hover:scale-105">
            TS
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-[#111110]">
            TechStore
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map(link => {
            const active = link.href === "/catalog"
              ? pathname === "/catalog"
              : pathname === "/catalog" && link.href.includes("brand");
            return (
              <Link key={link.href} href={link.href}
                className={cn(
                  "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150",
                  active
                    ? "bg-[#111110] text-[#fafaf8]"
                    : "text-[#6b6b68] hover:text-[#111110] hover:bg-[#ededea]"
                )}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/catalog"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6b6b68] hover:text-[#111110] hover:bg-[#ededea] transition-colors"
            title="Поиск">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>

          <Link href="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#6b6b68] hover:text-[#111110] hover:bg-[#ededea] transition-colors"
            title="Корзина">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-[3px] bg-[#111110] text-[#fafaf8] text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative ml-1" data-user-menu>
              <button onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-lg hover:bg-[#ededea] transition-colors">
                <span className="w-6 h-6 bg-[#111110] text-[#fafaf8] text-[10px] font-bold rounded-full flex items-center justify-center uppercase flex-shrink-0">
                  {user.name[0]}
                </span>
                <span className="text-[13px] font-medium text-[#111110] hidden sm:block max-w-[80px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#6b6b68]">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-48 bg-[#fafaf8] border border-[#e8e8e4] rounded-2xl shadow-xl shadow-black/8 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-[#e8e8e4] mb-1">
                    <p className="text-[12px] font-semibold text-[#111110] truncate">{user.name}</p>
                    <p className="text-[11px] text-[#6b6b68] truncate">{user.email}</p>
                  </div>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#111110] hover:bg-[#ededea] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    Мой кабинет
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#111110] hover:bg-[#ededea] transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Панель admin
                    </Link>
                  )}
                  <div className="border-t border-[#e8e8e4] mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login"
              className="ml-1 px-4 py-1.5 bg-[#111110] text-[#fafaf8] text-[13px] font-semibold rounded-lg hover:bg-[#2a2a28] transition-colors">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
