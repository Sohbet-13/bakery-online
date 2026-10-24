"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, User as UserIcon, Shield, UserX, UserCheck, Mail, Lock } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee";
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // Загрузка при монтировании (без вызова setState напрямую в эффекте)
  useEffect(() => {
    let isMounted = true;
    api.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (isMounted) {
        setUsers(res.data);
        setLoading(false);
      }
    })
    .catch(() => {
      if (isMounted) {
        toast.error("Ошибка загрузки сотрудников");
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [token]);

  // Функция для обновления списка после действий
  const refreshUsers = async () => {
    try {
      const response = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Ошибка загрузки сотрудников");
    }
  };

  const handleToggle = async (userId: number) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Статус сотрудника изменен");
      refreshUsers();
    } catch (error) {
      toast.error("Ошибка при смене статуса");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Сотрудник успешно добавлен");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "employee" });
      refreshUsers();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Ошибка при создании");
    }
  };

  if (loading) return <div className="text-dark-brown/50 p-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-dark-brown mb-2">Сотрудники</h1>
          <p className="text-dark-brown/60">Управление доступами.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
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
              <th className="p-4 pl-6">Сотрудник</th>
              <th className="p-4">Роль</th>
              <th className="p-4">Статус</th>
              <th className="p-4 pr-6 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-beige/10 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-medium text-dark-brown">{user.name}</div>
                  <div className="text-sm text-dark-brown/50">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`flex items-center gap-1.5 text-sm font-medium ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                    {user.is_active ? <UserCheck size={16} /> : <UserX size={16} />}
                    {user.is_active ? 'Активен' : 'Заблокирован'}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button 
                    onClick={() => handleToggle(user.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      user.is_active 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {user.is_active ? 'Заблокировать' : 'Разблокировать'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Мобильная версия (Карточки) */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-beige">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-dark-brown">{user.name}</h3>
                <p className="text-sm text-dark-brown/60">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                {user.role === 'admin' ? 'Админ' : 'Сотрудник'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className={`flex items-center gap-1.5 text-sm font-medium ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                {user.is_active ? <UserCheck size={16} /> : <UserX size={16} />}
                {user.is_active ? 'Активен' : 'Заблокирован'}
              </span>
              <button 
                onClick={() => handleToggle(user.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  user.is_active 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-green-50 text-green-600'
                }`}
              >
                {user.is_active ? 'Блок' : 'Разблок'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="p-10 text-center text-dark-brown/50 bg-white rounded-2xl border border-beige mt-4">
          Сотрудников пока нет.
        </div>
      )}

      {/* Модальное окно */}
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-cream rounded-3xl p-6 md:p-8 z-50 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-dark-brown">Новый сотрудник</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-beige rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Имя</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={18} />
                    <input 
                      type="text" required 
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={18} />
                    <input 
                      type="email" required 
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={18} />
                    <input 
                      type="password" required minLength={6}
                      value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-1">Роль</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-brown/40" size={18} />
                    <select 
                      value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 bg-white appearance-none"
                    >
                      <option value="employee">Сотрудник</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-dark-brown text-cream py-3 rounded-xl font-medium hover:bg-burgundy transition-colors">
                    Создать
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