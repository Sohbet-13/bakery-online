"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Camera, Send } from "lucide-react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { getSettings } from "@/lib/api";

export default function ContactsPage() {
  const [settings, setSettings] = useState({
    shop_name: "Пекарня Онлайн",
    phone: "+7 (900) 123-45-67",
    address: "г. Воронеж, ул. Пушкина, д. 15",
    work_hours: "Пн-Вс: с 08:00 до 20:00",
  });

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error("Ошибка настроек:", err));
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-dark-brown mb-6">
            Наши контакты
          </h1>
          <p className="text-lg text-dark-brown/70 max-w-2xl mx-auto">
            Ждем вас в нашей пекарне! Вы всегда можете связаться с нами по телефону или написать в социальных сетях.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-beige rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-burgundy" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-brown mb-1">Адрес</h3>
                <p className="text-dark-brown/70 text-lg">{settings.address}</p>
                <p className="text-dark-brown/50 text-sm mt-1">Вход со стороны парка</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-beige rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-burgundy" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-brown mb-1">Телефон</h3>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-dark-brown/70 text-lg hover:text-burgundy transition-colors">
                  {settings.phone}
                </a>
                <p className="text-dark-brown/50 text-sm mt-1">Для заказов и вопросов</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-beige rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-burgundy" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-brown mb-1">Режим работы</h3>
                <p className="text-dark-brown/70 text-lg">{settings.work_hours}</p>
                <p className="text-dark-brown/50 text-sm mt-1">Без перерывов и выходных</p>
              </div>
            </div>

            <div className="pt-6 border-t border-beige">
              <h3 className="text-xl font-bold text-dark-brown mb-4">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <Link href="#" className="w-12 h-12 bg-dark-brown text-cream rounded-full flex items-center justify-center hover:bg-burgundy transition-colors">
                  <Camera size={20} />
                </Link>
                <Link href="#" className="w-12 h-12 bg-dark-brown text-cream rounded-full flex items-center justify-center hover:bg-burgundy transition-colors">
                  <Send size={20} />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl bg-beige">
            <img src="/images/hero-bread.jpg" alt="Наша пекарня" className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/60 to-transparent flex items-end p-8">
              <p className="text-cream text-xl font-medium">Приходите за свежим хлебом!</p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </PublicLayout>
  );
}