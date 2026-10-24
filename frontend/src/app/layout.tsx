import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/shared/SmoothScroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Пекарня Онлайн",
  description: "Свежий хлеб и выпечка каждый день",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Пекарня",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3E2723",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-cream text-dark-brown antialiased`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        
        {/* Здесь мы задаем глобальную длительность уведомлений в 1.5 секунды */}
        <Toaster position="top-right" richColors duration={1500} />
      </body>
    </html>
  );
}