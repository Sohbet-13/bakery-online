"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Package, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  pickup_at: string;
  total_amount: string;
  status: string;
  items: OrderItem[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    api.get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  // Функция смены статуса
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      
      // Обновляем локальный стейт, чтобы не перезагружать страницу
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Ошибка при смене статуса", error);
      alert("Не удалось обновить статус");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-700";
      case "Confirmed": return "bg-yellow-100 text-yellow-700";
      case "Preparing": return "bg-orange-100 text-orange-700";
      case "Ready": return "bg-green-100 text-green-700";
      case "Completed": return "bg-gray-100 text-gray-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Получаем следующий статус для кнопки
  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "New": return { label: "Подтвердить", value: "Confirmed" };
      case "Confirmed": return { label: "Начать готовить", value: "Preparing" };
      case "Preparing": return { label: "Готов", value: "Ready" };
      case "Ready": return { label: "Выдан", value: "Completed" };
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-beige/20">
      <header className="bg-dark-brown text-cream shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={24} />
            <h1 className="text-xl font-serif font-bold">Панель управления</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-cream/80 hover:text-cream transition-colors">
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-serif font-bold text-dark-brown">Заказы</h2>
            <p className="text-dark-brown/60 mt-1">Управляйте заказами клиентов</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-beige text-sm font-medium">
            Всего заказов: <span className="text-burgundy text-lg ml-1">{orders.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-dark-brown/50">Загрузка заказов...</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              
              return (
                <motion.div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-beige flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg text-dark-brown">{order.order_number}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-dark-brown/70 space-y-1">
                      <p>Клиент: <span className="font-medium text-dark-brown">{order.customer_name}</span> ({order.customer_phone})</p>
                      <p>Время: <span className="font-medium text-dark-brown">{new Date(order.pickup_at).toLocaleString("ru-RU")}</span></p>
                    </div>
                  </div>

                  <div className="flex-1 border-t md:border-t-0 md:border-l border-beige pt-4 md:pt-0 md:pl-6 w-full">
                    <ul className="text-sm text-dark-brown/80 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.product_name} <span className="text-dark-brown/40">x{item.quantity}</span></span>
                          <span className="font-medium">{Math.round(Number(item.unit_price) * item.quantity)} ₽</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-end border-t md:border-t-0 md:border-l border-beige pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                    <span className="text-sm text-dark-brown/50 mb-1">Итого</span>
                    <span className="text-2xl font-bold text-dark-brown">{Math.round(Number(order.total_amount))} ₽</span>
                    
                    {nextStatus && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, nextStatus.value)}
                        disabled={updatingId === order.id}
                        className="mt-3 text-xs bg-beige text-dark-brown px-4 py-2 rounded-full hover:bg-light-brown/50 transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {updatingId === order.id ? "Обновление..." : nextStatus.label} 
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}