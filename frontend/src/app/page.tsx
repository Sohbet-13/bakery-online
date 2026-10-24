"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import ProductCard from "@/components/bakery/ProductCard";
import ProductSkeleton from "@/components/bakery/ProductSkeleton";
import { getCatalog } from "@/lib/api";
import { Product } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalog()
      .then((data) => {
        const featured = data.products.filter((p: Product) => p.is_featured);
        setProducts(featured);
      })
      .catch((err) => console.error("Ошибка API:", err))
      .finally(() => setLoading(false));
  }, []);

  // Варианты анимации для текста (каскадное появление)
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 + 0.3, duration: 0.8, ease: "easeOut" as const }
    })
  };

  return (
    <PublicLayout>
      {/* Hero Section (Темный баннер) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative bg-[#2A1B15] rounded-[2rem] overflow-hidden grid md:grid-cols-2 gap-8 items-center p-8 md:p-16">
          
          {/* Текстовая часть */}
          <div className="space-y-6 z-10">
            <motion.h1 
              custom={0} variants={textVariants} initial="hidden" animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl text-cream leading-[1.1] font-serif font-bold"
            >
              Свежий хлеб <br /> и выпечка
            </motion.h1>
            <motion.h1 
              custom={1} variants={textVariants} initial="hidden" animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl text-[#D4B499] italic font-serif font-bold mt-2"
            >
              каждый день
            </motion.h1>
            
            <motion.p 
              custom={2} variants={textVariants} initial="hidden" animate="visible"
              className="text-lg text-cream/70 max-w-md pt-4"
            >
              Ремесленный хлеб на закваске и натуральные десерты с доставкой и самовывозом в Воронеже.
            </motion.p>
            
            <motion.div
              custom={3} variants={textVariants} initial="hidden" animate="visible"
            >
              <Link 
                href="/catalog" 
                className="inline-flex items-center gap-2 bg-[#4A1C1C] text-cream px-8 py-4 rounded-full font-medium hover:bg-cream hover:text-dark-brown transition-all duration-300 group mt-4"
              >
                Перейти в каталог
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Картинка с эффектом "парения" */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            <motion.img 
              // Анимация левитации: двигаем картинку вверх-вниз бесконечно
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }} // Легкое увеличение при наведении
              src="/images/hero-bread.jpg" 
              alt="Свежий хлеб" 
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Бегущая строка (Marquee) */}
      <div className="bg-brown text-cream py-4 my-8 -rotate-1 scale-105 shadow-xl">
        <div className="flex whitespace-nowrap overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4 animate-marquee">
              <span className="text-lg font-serif italic">Свежая выпечка каждое утро</span>
              <span className="text-xl">•</span>
              <span className="text-lg font-serif italic">Только натуральные ингредиенты</span>
              <span className="text-xl">•</span>
              <span className="text-lg font-serif italic">Приготовлено с любовью в Воронеже</span>
              <span className="text-xl">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Секция Популярное в меню */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-dark-brown mb-6">Популярное в меню</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Секция О нас */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-beige grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
             <img src="/images/bread.jpg" alt="О нашей пекарне" className="object-cover w-full h-full" />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-dark-brown">Испечено с душой</h2>
            <p className="text-lg text-dark-brown/70 leading-relaxed">
              Наша пекарня начала свой путь с простой идеи — вернуть на столы тот самый вкус настоящего хлеба, который помнят наши бабушки. Мы используем только живую закваску, цельнозерновую муку и никаких искусственных улучшителей.
            </p>
            <p className="text-lg text-dark-brown/70 leading-relaxed">
              Каждое утро в 4 часа наши пекари начинают творить магию, чтобы к вашему завтраку на полках лежал горячий, хрустящий и ароматный хлеб.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}