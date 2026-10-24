"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, Users } from "lucide-react";

// Описываем структуру заказа для статистики (без лишних полей)
interface OrderStats {
  status: string;
  created_at: string;
  total_amount: string;
}

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState({
    newOrders: 0,
    todayRevenue: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    api.get("/admin/orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const orders: OrderStats[] = res.data; // Указали тип
      const today = new Date().toISOString().split('T')[0];
      
      let newOrdersCount = 0;
      let revenue = 0;

      orders.forEach((order) => {
        if (order.status === 'New') newOrdersCount++;
        if (order.created_at.startsWith(today)) {
          revenue += Number(order.total_amount);
        }
      });

      setStats({
        newOrders: newOrdersCount,
        todayRevenue: revenue,
        totalOrders: orders.length,
      });
    })
    .catch((err) => console.error("Ошибка статистики:", err));
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-serif font-bold text-dark-brown mb-2">
          Привет, {user?.name || "Сотрудник"}! 👋
        </h1>
        <p className="text-dark-brown/60">Вот что происходит в вашей пекарне сегодня.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-beige flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-dark-brown/50 text-sm mb-1">Новые заказы</p>
            <h3 className="text-3xl font-bold text-dark-brown">{stats.newOrders}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-beige flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-dark-brown/50 text-sm mb-1">Выручка за сегодня</p>
            <h3 className="text-3xl font-bold text-dark-brown">{Math.round(stats.todayRevenue)} ₽</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-beige flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-dark-brown/50 text-sm mb-1">Всего заказов</p>
            <h3 className="text-3xl font-bold text-dark-brown">{stats.totalOrders}</h3>
          </div>
        </motion.div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-beige text-center text-dark-brown/50">
        <p>Статистика обновляется в реальном времени.</p>
        <p className="text-sm mt-2">Перейдите во вкладку «Заказы», чтобы начать обработку.</p>
      </div>
    </div>
  );
}