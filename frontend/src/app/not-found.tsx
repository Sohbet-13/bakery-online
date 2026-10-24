import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-32 h-32 bg-beige rounded-full flex items-center justify-center mb-8">
          <Search size={64} className="text-brown/40" />
        </div>
        <h1 className="text-6xl font-serif font-bold text-dark-brown mb-4">404</h1>
        <h2 className="text-2xl font-bold text-dark-brown mb-4">Страница не найдена</h2>
        <p className="text-dark-brown/60 max-w-md mb-8">
          Похоже, этот багет потерялся по дороге к вам. Но не расстраивайтесь, у нас есть много другой свежей выпечки!
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-dark-brown text-cream px-8 py-4 rounded-full font-medium hover:bg-burgundy transition-colors"
        >
          <ArrowLeft size={20} /> Вернуться на главную
        </Link>
      </div>
    </main>
  );
}