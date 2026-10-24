"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, X, Image as ImageIcon } from "lucide-react";
import { getProductImage } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: string;
  description: string;
  is_available: number;
  is_featured: number;
  image_path: string;
  category?: Category;
}

const loadAdminData = async (token: string) => {
  const [productsRes, catalogRes] = await Promise.all([
    api.get("/admin/products", { headers: { Authorization: `Bearer ${token}` } }),
    api.get("/catalog")
  ]);
  return {
    products: productsRes.data,
    categories: catalogRes.data.categories
  };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    description: "",
    is_available: 1,
    is_featured: 0,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadAdminData(token as string)
      .then((data) => {
        if (isMounted) {
          setProducts(data.products);
          setCategories(data.categories);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Ошибка загрузки данных");
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [token]);

  const refreshData = async () => {
    try {
      const data = await loadAdminData(token as string);
      setProducts(data.products);
      setCategories(data.categories);
    } catch (error) {
      toast.error("Не удалось обновить список");
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category_id: String(product.category_id),
        price: product.price,
        description: product.description || "",
        is_available: product.is_available,
        is_featured: product.is_featured,
      });
      setPreviewImage(product.image_path.startsWith('products/') ? `http://192.168.0.103:8000/storage/${product.image_path}` : getProductImage(product.name));
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category_id: categories[0]?.id.toString() || "",
        price: "",
        description: "",
        is_available: 1,
        is_featured: 0,
      });
      setPreviewImage(null);
    }
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category_id', formData.category_id);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('is_available', String(formData.is_available));
      data.append('is_featured', String(formData.is_featured));
      
      if (selectedImage) {
        data.append('image', selectedImage);
      }

      if (editingProduct) {
        data.append('_method', 'PUT'); 
        await api.post(`/admin/products/${editingProduct.id}`, data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Товар обновлен");
      } else {
        await api.post("/admin/products", data, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Товар добавлен");
      }
      
      setIsModalOpen(false);
      refreshData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Ошибка при сохранении");
    }
  };

  if (loading) return <div className="text-dark-brown/50 p-8">Загрузка товаров...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-dark-brown mb-2">Товары</h1>
          <p className="text-dark-brown/60">Управление каталогом.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-dark-brown text-cream px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-burgundy transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Добавить
        </button>
      </div>

      {/* ПК Версия (Таблица) */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-beige overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-beige/50 text-dark-brown font-medium">
            <tr>
              <th className="p-4 pl-6">Фото</th>
              <th className="p-4">Название</th>
              <th className="p-4">Категория</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Статус</th>
              <th className="p-4 pr-6 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-beige/10 transition-colors">
                <td className="p-4 pl-6">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-beige">
                    <img 
                      src={product.image_path.startsWith('products/') ? `http://192.168.0.103:8000/storage/${product.image_path}` : getProductImage(product.name)} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </td>
                <td className="p-4 font-medium text-dark-brown">{product.name}</td>
                <td className="p-4 text-dark-brown/60">{product.category?.name || "—"}</td>
                <td className="p-4 font-bold text-dark-brown">{Math.round(Number(product.price))} ₽</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.is_available ? "В наличии" : "Скрыт"}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button onClick={() => openModal(product)} className="p-2 text-dark-brown/50 hover:text-burgundy transition-colors">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия (Карточки) */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-beige flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-beige flex-shrink-0">
              <img 
                src={product.image_path.startsWith('products/') ? `http://192.168.0.103:8000/storage/${product.image_path}` : getProductImage(product.name)} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-dark-brown leading-tight mb-1">{product.name}</h3>
              <p className="text-sm text-dark-brown/60 mb-2">{product.category?.name}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{Math.round(Number(product.price))} ₽</span>
                <button onClick={() => openModal(product)} className="p-2 bg-beige rounded-lg hover:bg-light-brown/50 transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="p-10 text-center text-dark-brown/50 bg-white rounded-2xl border border-beige mt-4">
          Товаров пока нет.
        </div>
      )}

      {/* Модальное окно добавления/редактирования */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-cream rounded-3xl p-6 md:p-8 z-50 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-dark-brown">
                  {editingProduct ? "Редактировать" : "Новый товар"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-beige rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-beige flex items-center justify-center overflow-hidden border border-beige flex-shrink-0">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-dark-brown/30" size={28} />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-dark-brown mb-1">Фотография</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-dark-brown/60 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-beige file:text-dark-brown hover:file:bg-light-brown/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Название</label>
                  <input 
                    type="text" required 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-1">Категория</label>
                    <select 
                      required
                      value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-brown mb-1">Цена (₽)</label>
                    <input 
                      type="number" required min="0" step="1"
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Описание</label>
                  <textarea 
                    rows={3}
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white resize-none" 
                  />
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_available === 1}
                      onChange={(e) => setFormData({...formData, is_available: e.target.checked ? 1 : 0})}
                      className="w-5 h-5 accent-brown rounded"
                    />
                    <span className="text-sm text-dark-brown">В наличии</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.is_featured === 1}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked ? 1 : 0})}
                      className="w-5 h-5 accent-brown rounded"
                    />
                    <span className="text-sm text-dark-brown">Популярное</span>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-dark-brown text-cream py-3 rounded-xl font-medium hover:bg-burgundy transition-colors">
                    {editingProduct ? "Сохранить" : "Добавить"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-beige text-dark-brown hover:bg-beige transition-colors">
                    Отмена
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}