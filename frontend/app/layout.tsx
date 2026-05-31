import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Body — Inter: лучший UI-шрифт с полноценной кириллицей
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Display — Montserrat: выразительный, отличная кириллица
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechStore — техника Apple, Samsung и других брендов",
  description: "Интернет-магазин оригинальной техники. Смартфоны, ноутбуки, планшеты, наушники и смарт-часы.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#111110]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111110",
              color: "#FAFAF8",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "var(--font-body)",
              borderRadius: "10px",
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            },
          }}
        />
      </body>
    </html>
  );
}
