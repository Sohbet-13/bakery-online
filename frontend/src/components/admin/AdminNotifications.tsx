"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";

// Типизируем заказ, чтобы не использовать any
interface OrderCheck {
  status: string;
}

// Расширяем Window для Safari (webkitAudioContext)
interface ExtendedWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export default function AdminNotifications() {
  const { token } = useAuthStore();
  const lastOrderCount = useRef<number | null>(null);

  // Функция звука с проверкой браузера
  const playSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as ExtendedWindow).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Звук заблокирован браузером");
    }
  };

  useEffect(() => {
    if (!token) return;

    const checkNewOrders = async () => {
      try {
        const response = await api.get("/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Убрали any, используем OrderCheck
        const newOrders = response.data.filter((o: OrderCheck) => o.status === "New");
        
        if (lastOrderCount.current !== null && newOrders.length > lastOrderCount.current) {
          playSound();
          toast.success("🔔 Поступил новый заказ!", {
            description: "Проверьте вкладку «Заказы».",
            duration: 10000,
          });
        }
        
        lastOrderCount.current = newOrders.length;
      } catch (error) {
        // Игнорируем ошибки сети
      }
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 15000);

    return () => clearInterval(interval);
  }, [token]);

  return null;
}