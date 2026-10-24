import Link from "next/link";
import { Wheat } from "lucide-react";

interface LogoProps {
  variant?: "dark" | "light";
}

export default function Logo({ variant = "dark" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Иконка */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300 ${
        isLight 
          ? "bg-cream text-dark-brown group-hover:bg-beige" 
          : "bg-dark-brown text-cream group-hover:bg-burgundy"
      }`}>
        <Wheat size={22} className="group-hover:rotate-12 transition-transform duration-300" />
      </div>
      
      {/* Текст */}
      <div className="flex flex-col leading-tight">
        <span className={`font-serif font-bold text-lg tracking-wide ${
          isLight ? "text-cream" : "text-dark-brown"
        }`}>
          ПЕКАРНЯ
        </span>
        <span className={`text-[10px] tracking-[0.25em] font-medium ${
          isLight ? "text-cream/70" : "text-brown"
        }`}>
          ОНЛАЙН
        </span>
      </div>
    </Link>
  );
}