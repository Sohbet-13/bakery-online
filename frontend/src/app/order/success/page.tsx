"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("number");

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center min-h-[60vh]">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 size={48} />
      </div>
      <h1 className="text-4xl text-dark-brown mb-4">Заказ успешно оформлен!</h1>
      <p className="text-lg text-dark-brown/60 mb-8">
        Номер вашего заказа: <span className="font-bold text-dark-brown">{orderNumber || "..."}</span>
      </p>
      <p className="text-dark-brown/60 mb-8">
        Мы свяжемся с вами в ближайшее время для подтверждения.
      </p>
      <Link href="/" className="inline-block bg-dark-brown text-cream px-8 py-4 rounded-full font-medium hover:bg-burgundy transition-colors">
        Вернуться на главную
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="text-center py-24 text-dark-brown/50">Загрузка...</div>}>
        <SuccessContent />
      </Suspense>
    </PublicLayout>
  );
}