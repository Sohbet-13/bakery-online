"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileNav } from "@/components/admin/MobileNav";
import AdminNotifications from "@/components/admin/AdminNotifications"; // <-- Импорт

const useHasHydrated = () => {
  return useSyncExternalStore(
    (callback) => {
      if (!useAuthStore.persist) return () => {};
      return useAuthStore.persist.onFinishHydration(callback);
    },
    () => (useAuthStore.persist ? useAuthStore.persist.hasHydrated() : true),
    () => false
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (hasHydrated && !token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [token, router, pathname, hasHydrated]);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-dark-brown">Загрузка...</div>;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Компонент уведомлений (работает в фоне) */}
      <AdminNotifications />

      <aside className="w-64 bg-dark-brown text-cream flex-col hidden md:flex fixed h-full z-30">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-serif font-bold text-white">Пекарня Админ</h1>
        </div>
        <Sidebar />
      </aside>

      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto h-screen">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}