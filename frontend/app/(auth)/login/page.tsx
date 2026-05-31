"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPwd,  setShowPwd]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem("accessToken",  data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      setAuth(data.user, data.tokens);
      toast.success(`Добро пожаловать, ${data.user.name}`);
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Неверный email или пароль");
    } finally { setLoading(false); }
  }

  const inputCls = "w-full px-4 py-3 text-base bg-white border border-[#E4E4E7] rounded-xl outline-none focus:border-[#111110] focus:ring-2 focus:ring-[#111110]/10 transition-all placeholder:text-[#A1A1AA] text-[#111110]";

  return (
    <div className="w-full max-w-[420px]" style={{ fontFamily: "var(--font-body)" }}>
      <div className="mb-8">
        <h1 className="font-display font-bold text-[#111110] mb-2" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
          Вход в аккаунт
        </h1>
        <p className="text-base text-[#71717A]">Введите данные для входа</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#3F3F46] mb-2">Email</label>
          <input
            type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#3F3F46] mb-2">Пароль</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Минимум 6 символов"
              value={password} onChange={e => setPassword(e.target.value)} required
              className={`${inputCls} pr-12`}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#71717A] transition-colors"
            >
              {showPwd
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-3.5 bg-[#111110] hover:bg-[#3F3F46] text-white font-semibold text-base rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>

      <p className="text-sm text-center text-[#71717A] mt-6">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-[#111110] font-semibold hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
