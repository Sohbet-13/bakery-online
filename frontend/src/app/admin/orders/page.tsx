"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clock, Phone, User, Package, ChevronDown } from "lucide-react";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  pickup_at: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  New: "Новый",
  Confirmed: "Подтвержден",
  Preparing: "Готовится",
  Ready: "Готов",
  Completed: "Выдан",
  Cancelled: "Отменен",
};

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Confirmed: "bg-purple-100 text-purple-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  Ready: "bg-green-100 text-green-700",
  Completed: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const response = await api.get("/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          setOrders(response.data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Ошибка загрузки заказов");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(
        `/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Статус обновлен");
    } catch (error) {
      toast.error("Ошибка при смене статуса");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-dark-brown/50">Загрузка заказов...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-dark-brown mb-2">Заказы</h1>
        <p className="text-dark-brown/60">Управляйте заказами клиентов и их статусами.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl text-center border border-beige text-dark-brown/50">
          Пока нет ни одного заказа.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-beige"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-beige pb-6">
                <div>
                  <h3 className="text-xl font-bold text-dark-brown flex items-center gap-3">
                    Заказ #{order.order_number}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </h3>
                  <p className="text-sm text-dark-brown/50 mt-1">
                    Оформлен: {formatDate(order.created_at)}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-dark-brown/50">Итого</p>
                    <p className="text-2xl font-bold text-dark-brown">{Math.round(Number(order.total_amount))} ₽</p>
                  </div>
                  
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="appearance-none bg-beige text-dark-brown font-medium px-4 py-2 pr-10 rounded-xl focus:outline-none cursor-pointer border border-beige"
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-brown/50 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-bold text-dark-brown mb-3 text-lg">Клиент</h4>
                  <div className="flex items-center gap-3 text-dark-brown/80">
                    <User size={18} className="text-burgundy" /> {order.customer_name}
                  </div>
                  <div className="flex items-center gap-3 text-dark-brown/80">
                    <Phone size={18} className="text-burgundy" /> {order.customer_phone}
                  </div>
                  <div className="flex items-center gap-3 text-dark-brown/80">
                    <Clock size={18} className="text-burgundy" /> 
                    <span>Забрать: <strong>{formatDate(order.pickup_at)}</strong></span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-dark-brown mb-3 text-lg flex items-center gap-2">
                    <Package size={18} /> Состав заказа
                  </h4>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between text-dark-brown/80 text-sm">
                        <span>{item.product_name} <span className="text-dark-brown/50">x{item.quantity}</span></span>
                        <span className="font-medium">{Math.round(Number(item.line_total))} ₽</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}