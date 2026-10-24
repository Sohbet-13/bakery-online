"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/admin/login", { email, password });
      
      // Сохраняем данные в Zustand
      setAuth(response.data.user, response.data.token);
      
      toast.success("Добро пожаловать в панель управления!");
      router.push("/admin"); // Перекидываем на дашборд
      
    } catch (err: unknown) {
      // Исправляем any на unknown
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Ошибка входа. Проверьте данные.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Левая сторона: Форма */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <Link href="/" className="inline-block text-3xl font-serif font-bold text-dark-brown mb-2">
              Пекарня <span className="text-burgundy">Онлайн</span>
            </Link>
            <h2 className="text-2xl font-bold text-dark-brown mt-6">Вход в панель управления</h2>
            <p className="text-dark-brown/60 mt-2">Только для сотрудников</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 bg-white p-8 rounded-3xl shadow-xl border border-beige">
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" 
                  placeholder="admin@pekarnya.ru"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-brown mb-2">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-dark-brown text-cream py-4 rounded-xl font-medium hover:bg-burgundy transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? "Вход..." : "Войти"} <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-dark-brown/50 text-sm">
            <Link href="/" className="hover:text-burgundy transition-colors">← Вернуться на сайт</Link>
          </p>
        </motion.div>
      </div>

      {/* Правая сторона: Картинка (скрыта на мобильных) */}
      <div className="hidden md:block w-1/2 bg-beige relative overflow-hidden">
        <img 
          src="/images/hero-bread.jpg" 
          alt="Пекарня" 
          className="object-cover w-full h-full opacity-90"
        />
        <div className="absolute inset-0 bg-dark-brown/20 mix-blend-multiply"></div>
      </div>
    </div>
  );
}