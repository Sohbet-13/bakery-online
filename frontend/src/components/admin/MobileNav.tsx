"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Settings, Users } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const menu = [
    { name: "Главная", icon: <LayoutDashboard size={22} />, path: "/admin" },
    { name: "Заказы", icon: <ShoppingCart size={22} />, path: "/admin/orders" },
    { name: "Товары", icon: <Package size={22} />, path: "/admin/products" },
    { name: "Люди", icon: <Users size={22} />, path: "/admin/users" },
    { name: "Настройки", icon: <Settings size={22} />, path: "/admin/settings" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-beige z-40 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-burgundy" : "text-dark-brown/50 hover:text-dark-brown"
              } transition-colors`}
            >
              {item.icon}
              <span className="text-[9px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}