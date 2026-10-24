"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicLayout from "@/components/layout/PublicLayout";
import { getProductBySlug } from "@/lib/api";
import { Product } from "@/types";
import { getProductImage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function ProductContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then((data) => setProduct(data))
      .catch((err) => console.error("Товар не найден", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_path: product.image_path || "",
    });
    toast.success(`${product.name} в корзине!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-full h-[500px] bg-beige rounded-3xl mb-8"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <h1 className="text-4xl font-serif text-dark-brown mb-4">Товар не найден</h1>
        <p className="text-dark-brown/60 mb-8">Возможно, он был удален или закончился.</p>
        <button onClick={() => router.push("/catalog")} className="bg-dark-brown text-cream px-8 py-3 rounded-full hover:bg-burgundy transition-colors">
          Вернуться в каталог
        </button>
      </div>
    );
  }

  const imageUrl = product.image_path && product.image_path.startsWith('products/') 
    ? `http://192.168.0.103:8000/storage/${product.image_path}` 
    : getProductImage(product.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-dark-brown/60 hover:text-burgundy mb-8 transition-colors font-medium">
        <ArrowLeft size={20} /> Назад
      </button>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] overflow-hidden shadow-2xl bg-white p-4 sticky top-28">
          <img src={imageUrl} alt={product.name} className="w-full h-auto aspect-square object-cover rounded-2xl" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark-brown mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="text-lg text-dark-brown/50">
              Вес: {product.name.includes("Хлеб") ? "450г" : product.name.includes("Багет") ? "250г" : "110г"}
            </p>
          </div>

          <div className="text-4xl font-bold text-burgundy">
            {Math.round(Number(product.price))} ₽
          </div>

          <p className="text-lg text-dark-brown/80 leading-relaxed">
            {product.description || "Свежайшая выпечка, приготовленная с любовью по традиционным рецептам."}
          </p>

          {product.ingredients && (
            <div className="bg-beige/40 p-6 rounded-3xl border border-beige">
              <h3 className="font-bold text-dark-brown mb-3 flex items-center gap-2 text-lg">
                <CheckCircle2 size={20} className="text-burgundy" /> Состав
              </h3>
              <p className="text-dark-brown/70 text-md leading-relaxed">{product.ingredients}</p>
            </div>
          )}

          <button onClick={handleAddToCart} className="w-full bg-dark-brown text-cream py-5 rounded-full text-xl font-medium hover:bg-burgundy transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl">
            Добавить в корзину
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="text-center py-24 text-dark-brown/50">Загрузка товара...</div>}>
        <ProductContent />
      </Suspense>
    </PublicLayout>
  );
}