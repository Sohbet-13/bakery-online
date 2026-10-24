"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import ProductCard from "@/components/bakery/ProductCard";
import ProductSkeleton from "@/components/bakery/ProductSkeleton";
import { getCatalog } from "@/lib/api";
import { Product, Category } from "@/types";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для фильтрации
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    getCatalog()
      .then((data) => {
        setProducts(data.products);
        setCategories(data.categories);
      })
      .catch((err) => console.error("Ошибка API:", err))
      .finally(() => setLoading(false));
  }, []);

  // Логика фильтрации и сортировки
  let filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category_id === Number(activeCategory));

  // Фильтр по поиску
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Сортировка
  if (sortBy === "price-asc") {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price-desc") {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-5xl text-dark-brown mb-6">Каталог продукции</h1>
          <p className="text-dark-brown/60 max-w-2xl mx-auto">
            Наша свежая выпечка, хлеб и десерты. Всё готовится в день выдачи.
          </p>
        </div>

        {/* Панель управления: Поиск, Фильтры, Сортировка */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-beige mb-12 space-y-6">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Поиск */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={20} />
              <input 
                type="text" 
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream text-dark-brown"
              />
            </div>

            {/* Сортировка */}
            <div className="relative w-full md:w-64">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-12 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream text-dark-brown font-medium cursor-pointer"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
              </select>
            </div>
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-beige">
            <button 
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "all" ? "bg-brown text-cream" : "bg-beige text-dark-brown hover:bg-light-brown/50"
              }`}
            >
              Все
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(String(cat.id))}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === String(cat.id) ? "bg-brown text-cream" : "bg-beige text-dark-brown hover:bg-light-brown/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка товаров */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-beige">
            <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-brown/40" size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-dark-brown mb-2">Ничего не найдено</h3>
            <p className="text-dark-brown/60">Попробуйте изменить запрос или выбрать другую категорию.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); setSortBy("default"); }}
              className="mt-6 text-burgundy font-medium hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}