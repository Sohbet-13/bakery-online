"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { getSettings } from "@/lib/api";
import Logo from "./Logo"; // <-- Импортируем логотип

interface Settings {
  shop_name?: string;
  phone?: string;
  address?: string;
  work_hours?: string;
}

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  const [settings, setSettings] = useState<Settings>({
    shop_name: "Пекарня Онлайн",
    phone: "+7 (900) 123-45-67",
    address: "г. Воронеж, ул. Пушкина, д. 15",
    work_hours: "Пн-Вс: с 08:00 до 20:00",
  });

  useEffect(() => {
    setYear(new Date().getFullYear());

    getSettings()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error("Ошибка настроек:", err));
  }, []);

  return (
    <footer className="bg-dark-brown text-cream mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Логотип и описание */}
          <div>
            <div className="mb-6">
              {/* Используем светлую версию логотипа */}
              <Logo variant="light" />
            </div>
            <p className="text-cream/60 leading-relaxed">
              Свежий хлеб на закваске, круассаны и десерты. Готовим с любовью каждое утро.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6">Меню</h3>
            <ul className="space-y-3 text-cream/60">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">Условия заказа</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-6">Контакты</h3>
            <ul className="space-y-4 text-cream/60">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#D4B499] flex-shrink-0 mt-1" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#D4B499] flex-shrink-0" />
                <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={20} className="text-[#D4B499] flex-shrink-0 mt-1" />
                <span>{settings.work_hours}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 text-center text-cream/40 text-sm">
          <p>© {year || 2026} {settings.shop_name}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}