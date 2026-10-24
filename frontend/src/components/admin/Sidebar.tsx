"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, LogOut, Settings, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/lib/api";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const menu = [
    { name: "Дашборд", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Заказы", icon: <ShoppingCart size={20} />, path: "/admin/orders" },
    { name: "Товары", icon: <Package size={20} />, path: "/admin/products" },
    { name: "Сотрудники", icon: <Users size={20} />, path: "/admin/users" }, // <-- НОВЫЙ ПУНКТ
    { name: "Настройки", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (e) {}
    logout();
    toast.success("Вы вышли из системы");
    router.push("/admin/login");
  };

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              pathname === item.path
                ? "bg-white/10 text-white font-medium"
                : "text-cream/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-cream/60 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          Выйти
        </button>
      </div>
    </div>
  );
}