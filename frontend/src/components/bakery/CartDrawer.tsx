"use client";

import Link from "next/link"; 
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { getProductImage } from "@/lib/utils";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, totalPrice, addItem, clearCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-beige">
              <div className="flex items-center gap-2 text-dark-brown">
                <ShoppingBag size={20} />
                <h2 className="text-xl font-serif font-bold">Корзина</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-beige rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center mt-[-40px]">
                  <div className="w-24 h-24 bg-beige rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} className="text-brown/40" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-dark-brown mb-2">Корзина пуста</h3>
                  <p className="text-dark-brown/60 mb-8 max-w-[250px]">
                    Похоже, вы еще не выбрали ничего вкусного. Самое время это исправить!
                  </p>
                  <Link 
                    href="/catalog" 
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-dark-brown text-cream px-6 py-3 rounded-full font-medium hover:bg-burgundy transition-colors"
                  >
                    Перейти в каталог <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  // Вычисляем путь к картинке
                  const imgUrl = item.image_path && item.image_path.startsWith('products/')
                    ? `http://192.168.0.103:8000/storage/${item.image_path}`
                    : getProductImage(item.name);

                  return (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-beige flex-shrink-0">
                      <img 
                        src={imgUrl} 
                        alt={item.name} 
                        className="object-cover w-full h-full" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-dark-brown leading-tight">{item.name}</h3>
                      <p className="text-sm text-dark-brown/60 mt-1">{item.price} ₽</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => removeItem(item.id)} className="p-1.5 bg-beige rounded-md hover:bg-light-brown/50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => {
                            addItem(item);
                            toast.success(`${item.name} добавлен`);
                          }} 
                          className="p-1.5 bg-beige rounded-md hover:bg-light-brown/50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )})
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-beige bg-white">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-dark-brown/70 block text-sm">Итого:</span>
                    <span className="text-2xl font-bold text-dark-brown">{totalPrice()} ₽</span>
                  </div>
                  <button 
                    onClick={() => {
                      clearCart();
                      toast.success("Корзина очищена");
                    }}
                    className="text-sm text-dark-brown/50 hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Очистить
                  </button>
                </div>
                
                <Link 
                  href="/checkout" 
                  onClick={onClose}
                  className="block w-full text-center bg-dark-brown text-cream py-4 rounded-full font-medium hover:bg-burgundy transition-colors"
                >
                  Оформить заказ
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}