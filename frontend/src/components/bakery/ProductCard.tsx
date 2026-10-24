"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { toast } from "sonner";
import { getProductImage } from "@/lib/utils";
import Link from "next/link";

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_path: product.image_path || "",
    });
    toast.success(`${product.name} в корзине!`);
  };

  const imageUrl = product.image_path && product.image_path.startsWith('products/') 
    ? `http://192.168.0.103:8000/storage/${product.image_path}` 
    : getProductImage(product.name);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group h-full relative"
    >
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col cursor-pointer">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-beige">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold text-dark-brown leading-tight mb-1 group-hover:text-burgundy transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-dark-brown/50 mb-3">
            {product.name.includes("Хлеб") ? "450г" : product.name.includes("Багет") ? "250г" : "110г"}
          </p>
        </div>
      </Link>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between mt-2 mb-4">
          <span className="text-xl font-bold text-dark-brown">
            {Math.round(Number(product.price))} ₽
          </span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-dark-brown text-cream py-2.5 rounded-full text-sm font-medium hover:bg-burgundy transition-colors active:scale-95"
        >
          В корзину
        </button>
      </div>
    </motion.div>
  );
}