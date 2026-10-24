"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "../bakery/CartDrawer";
import Logo from "./Logo"; // <-- Импортируем логотип

export default function Header() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/delivery", label: "Условия заказа" },
    { href: "/contacts", label: "Контакты" },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Заменили старый блок с буквой П на новый компонент */}
          <div className="z-50">
            <Logo />
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-dark-brown/80">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-burgundy transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 z-50">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-dark-brown text-cream px-4 sm:px-5 py-2.5 rounded-full hover:bg-burgundy transition-all duration-300"
            >
              <ShoppingBag size={18} />
              <span className="text-sm font-medium hidden sm:inline">Корзина</span>
              <span className="bg-cream text-dark-brown text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-dark-brown hover:bg-beige rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-cream pt-24 px-6 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 text-center mt-10">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif font-bold text-dark-brown hover:text-burgundy transition-colors block py-2">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}