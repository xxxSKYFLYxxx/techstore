"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPwd,  setShowPwd]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.register({ name, email, password });
      localStorage.setItem("accessToken",  data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      setAuth(data.user, data.tokens);
      toast.success("Аккаунт создан!");
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1.5">Создать аккаунт</h1>
        <p className="text-[13.5px] text-zinc-500">Заполните форму для регистрации</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-zinc-700 mb-1.5">Ваше имя</label>
          <input
            placeholder="Иван Иванов"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-3 text-[14px] bg-white border border-zinc-200 rounded-xl outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all placeholder:text-zinc-400 text-zinc-900"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-zinc-700 mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 text-[14px] bg-white border border-zinc-200 rounded-xl outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all placeholder:text-zinc-400 text-zinc-900"
          />
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-zinc-700 mb-1.5">Пароль</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-3 pr-11 text-[14px] bg-white border border-zinc-200 rounded-xl outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all placeholder:text-zinc-400 text-zinc-900"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPwd
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-[11.5px] text-orange-500 mt-1.5">Минимум 6 символов</p>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-red-50 border border-red-100 rounded-xl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-[14px] rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Создаём..." : "Создать аккаунт"}
        </button>
      </form>

      <p className="text-[13px] text-center text-zinc-500 mt-6">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
