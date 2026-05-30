import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Body — trending 2024, used by Linear, Vercel, Loom
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Display — editorial serif, used by Framer, Anthropic, top agencies 2024
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechStore — техника Apple, Samsung и других брендов",
  description: "Интернет-магазин оригинальной техники. Смартфоны, ноутбуки, планшеты, наушники и смарт-часы.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jakartaSans.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fafaf8] text-[#111110]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111110",
              color: "#fafaf8",
              fontSize: "13px",
              fontWeight: "500",
              fontFamily: "var(--font-sans)",
              borderRadius: "10px",
              padding: "10px 16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            },
          }}
        />
      </body>
    </html>
  );
}
