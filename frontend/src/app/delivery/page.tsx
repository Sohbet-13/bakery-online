"use client";

import { motion } from "framer-motion";
import { 
  Clock, 
  CreditCard, 
  CalendarClock, 
  Banknote, 
  Ban, 
  ShoppingBag, 
  MapPin, 
  CheckCircle2 
} from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";

export default function DeliveryPage() {
  // Анимации для появления блоков
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const }
    })
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-[#2A1B15] py-24 mb-16 overflow-hidden rounded-b-[3rem]">
        {/* Декоративные элементы на фоне */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-beige rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brown rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-cream mb-6"
          >
            Условия заказа
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-cream/70 max-w-2xl mx-auto"
          >
            Мы хотим, чтобы процесс заказа свежей выпечки был для вас простым, удобным и прозрачным.
          </motion.p>
        </div>
      </section>

      {/* Три главных правила (Карточки) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Время */}
          <motion.div 
            custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-beige/50 flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 bg-beige rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CalendarClock size={36} className="text-burgundy" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-dark-brown mb-4">Время приготовления</h3>
            <p className="text-dark-brown/70 leading-relaxed">
              Заказы принимаются заранее — <strong>за 1 сутки</strong>, либо минимум <strong>за 3–4 часа</strong> до желаемого времени получения.
            </p>
          </motion.div>

          {/* Оплата */}
          <motion.div 
            custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-beige/50 flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Banknote size={36} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-dark-brown mb-4">Способы оплаты</h3>
            <p className="text-dark-brown/70 leading-relaxed">
              Оплата происходит <strong>только при получении</strong>. Мы принимаем наличные или банковские карты. Предоплата не требуется.
            </p>
          </motion.div>

          {/* Отмена */}
          <motion.div 
            custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-beige/50 flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Ban size={36} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-dark-brown mb-4">Отмена заказа</h3>
            <p className="text-dark-brown/70 leading-relaxed">
              Вы можете отменить заказ заранее или <strong>минимум за 2 часа</strong> до назначенного времени. Просто позвоните нам.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Таймлайн: Как это работает */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-dark-brown mb-4">Как оформить заказ?</h2>
          <p className="text-dark-brown/60">Всего 4 простых шага отделяют вас от свежей выпечки.</p>
        </div>

        <div className="relative border-l-2 border-beige ml-4 md:ml-0 md:border-none md:flex md:flex-col md:items-center">
          
          {/* Шаг 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-12 ml-8 md:ml-0 md:w-full md:flex md:items-center md:justify-between md:odd:flex-row-reverse"
          >
            <div className="md:w-5/12 text-left md:text-right pr-8">
              <h4 className="text-xl font-bold text-dark-brown mb-2">Выбираете товары</h4>
              <p className="text-dark-brown/60">Добавляете в корзину хлеб, выпечку или десерты в нашем каталоге.</p>
            </div>
            <div className="absolute left-[-9px] md:static md:w-14 md:h-14 bg-dark-brown text-cream rounded-full flex items-center justify-center font-bold text-xl z-10 border-4 border-cream shadow-lg">
              1
            </div>
            <div className="hidden md:block md:w-5/12"></div>
          </motion.div>

          {/* Шаг 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-12 ml-8 md:ml-0 md:w-full md:flex md:items-center md:justify-between"
          >
            <div className="hidden md:block md:w-5/12"></div>
            <div className="absolute left-[-9px] md:static md:w-14 md:h-14 bg-dark-brown text-cream rounded-full flex items-center justify-center font-bold text-xl z-10 border-4 border-cream shadow-lg">
              2
            </div>
            <div className="md:w-5/12 text-left pl-0 md:pl-8">
              <h4 className="text-xl font-bold text-dark-brown mb-2">Указываете время</h4>
              <p className="text-dark-brown/60">При оформлении заказа выбираете удобную дату и время самовывоза.</p>
            </div>
          </motion.div>

          {/* Шаг 3 */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-12 ml-8 md:ml-0 md:w-full md:flex md:items-center md:justify-between md:odd:flex-row-reverse"
          >
            <div className="md:w-5/12 text-left md:text-right pr-8">
              <h4 className="text-xl font-bold text-dark-brown mb-2">Получаете подтверждение</h4>
              <p className="text-dark-brown/60">Наш сотрудник свяжется с вами по телефону для подтверждения деталей.</p>
            </div>
            <div className="absolute left-[-9px] md:static md:w-14 md:h-14 bg-dark-brown text-cream rounded-full flex items-center justify-center font-bold text-xl z-10 border-4 border-cream shadow-lg">
              3
            </div>
            <div className="hidden md:block md:w-5/12"></div>
          </motion.div>

          {/* Шаг 4 */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="ml-8 md:ml-0 md:w-full md:flex md:items-center md:justify-between"
          >
            <div className="hidden md:block md:w-5/12"></div>
            <div className="absolute left-[-9px] md:static md:w-14 md:h-14 bg-burgundy text-cream rounded-full flex items-center justify-center font-bold text-xl z-10 border-4 border-cream shadow-lg">
              <CheckCircle2 size={24} />
            </div>
            <div className="md:w-5/12 text-left pl-0 md:pl-8">
              <h4 className="text-xl font-bold text-dark-brown mb-2">Забираете заказ</h4>
              <p className="text-dark-brown/60">Приходите в пекарню в назначенное время, оплачиваете и забираете свежую выпечку!</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Призыв к действию */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-beige/50 p-10 md:p-16 rounded-[3rem]"
        >
          <ShoppingBag size={48} className="mx-auto text-burgundy mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-brown mb-4">Готовы сделать заказ?</h2>
          <p className="text-dark-brown/70 mb-8 max-w-lg mx-auto">
            Переходите в каталог, выбирайте любимые лакомства, и мы приготовим их специально для вас.
          </p>
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 bg-dark-brown text-cream px-8 py-4 rounded-full font-medium hover:bg-burgundy transition-all duration-300 group"
          >
            Перейти в каталог
          </Link>
        </motion.div>
      </section>

    </PublicLayout>
  );
}