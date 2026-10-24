"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Save, Store, Phone, MapPin, Clock } from "lucide-react";

export default function AdminSettingsPage() {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    shop_name: "",
    phone: "",
    address: "",
    work_hours: "",
  });

  useEffect(() => {
    api.get("/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setFormData({
          shop_name: res.data.shop_name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          work_hours: res.data.work_hours || "",
        });
      })
      .catch(() => toast.error("Ошибка загрузки настроек"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/settings", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Настройки успешно сохранены");
    } catch (error) {
      toast.error("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-dark-brown/50">Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-dark-brown mb-2">Настройки магазина</h1>
        <p className="text-dark-brown/60">Эта информация отображается на сайте для клиентов.</p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-beige space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2 flex items-center gap-2">
            <Store size={18} className="text-brown" /> Название пекарни
          </label>
          <input 
            type="text" 
            value={formData.shop_name}
            onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2 flex items-center gap-2">
            <Phone size={18} className="text-brown" /> Телефон
          </label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2 flex items-center gap-2">
            <MapPin size={18} className="text-brown" /> Адрес
          </label>
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-brown mb-2 flex items-center gap-2">
            <Clock size={18} className="text-brown" /> Режим работы
          </label>
          <input 
            type="text" 
            value={formData.work_hours}
            onChange={(e) => setFormData({...formData, work_hours: e.target.value})}
            placeholder="Пн-Вс: с 08:00 до 20:00"
            className="w-full px-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-cream" 
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-dark-brown text-cream py-4 rounded-xl font-medium hover:bg-burgundy transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={20} /> {saving ? "Сохранение..." : "Сохранить настройки"}
        </button>
      </motion.form>
    </div>
  );
}