"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, removeItem } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    pickup_at: "",
    comment: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formattedData = {
        ...formData,
        pickup_at: new Date(formData.pickup_at).toISOString(),
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      };

      const response = await api.post("/orders", formattedData);
      items.forEach((item) => removeItem(item.id));
      router.push(`/order/success?number=${response.data.order.order_number}`);
      
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string, error?: string, errors?: Record<string, string[]> } } };
      if (error.response?.data?.errors) {
         const firstErrorKey = Object.keys(error.response.data.errors)[0];
         setError(error.response.data.errors[firstErrorKey][0]);
      } else {
         setError(error.response?.data?.error || error.response?.data?.message || "Произошла ошибка при оформлении заказа");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-4 py-32 text-center min-h-[60vh]">
          <h1 className="text-4xl text-dark-brown mb-4">Корзина пуста</h1>
          <p className="text-dark-brown/60 mb-8">Добавьте товары, чтобы оформить заказ.</p>
          <Link href="/" className="bg-dark-brown text-cream px-8 py-3 rounded-full hover:bg-burgundy transition-colors">
            Вернуться в меню
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-dark-brown/60 hover:text-burgundy mb-8 transition-colors">
          <ArrowLeft size={20} /> Вернуться в каталог
        </Link>
        
        <h1 className="text-4xl text-dark-brown mb-8">Оформление заказа</h1>

        <div className="grid md:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5 bg-white p-6 md:p-8 rounded-3xl shadow-sm">
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Ваше имя *</label>
              <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Телефон *</label>
              <input required type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Email (необязательно)</label>
              <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1 flex items-center gap-2">
                <Clock size={16} /> Время получения *
              </label>
              <input required type="datetime-local" name="pickup_at" value={formData.pickup_at} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">Комментарий</label>
              <textarea name="comment" value={formData.comment} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream resize-none" />
            </div>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-dark-brown text-cream py-4 rounded-full font-medium hover:bg-burgundy transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Отправка..." : "Подтвердить заказ"}
            </button>
          </form>

          <div className="md:col-span-2">
            <div className="bg-beige/50 p-6 rounded-3xl sticky top-28">
              <h2 className="text-xl font-serif font-bold text-dark-brown mb-4">Ваш заказ</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-dark-brown/80">{item.name} <span className="text-dark-brown/40">x{item.quantity}</span></span>
                    <span className="font-medium">{item.price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-light-brown/30 pt-4 flex justify-between items-center">
                <span className="font-medium text-dark-brown">Итого:</span>
                <span className="text-2xl font-bold text-dark-brown">{totalPrice()} ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}