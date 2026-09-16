"use client";
import Link from "next/link";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useState, useEffect } from "react";

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
    { href: "#categories", label: "الأقسام" },
    { href: "#about", label: "من نحن" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "shadow-2xl" : ""}`}
      style={{ background: scrolled ? "var(--theme-primary)" : "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 100%)" }}>

      {/* Top accent bar */}
      <div className="hidden md:flex items-center justify-between px-8 py-1.5 text-xs border-b border-white/10"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        <div className="flex items-center gap-4 text-white/60">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            01127968425 — 01515194351
          </span>
          <span>📍 القاهرة - حدائق الزيتون، شارع العزيز بالله</span>
        </div>
        <span className="text-white/50 tracking-wider text-[10px] uppercase">Rawa&apos;e Al-Haram · Est. 2019</span>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--theme-secondary)] flex items-center justify-center text-xl bg-black/30 group-hover:scale-110 transition-transform">
            🕌
          </div>
          <div className="leading-tight">
            <span className="block text-white font-extrabold text-xl tracking-wide drop-shadow-md">روائع الحرم</span>
            <span className="block text-[var(--theme-secondary)] text-[10px] tracking-[0.2em] font-medium opacity-80">RAWA&apos;E AL-HARAM</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="relative px-4 py-2 text-white/85 hover:text-white text-sm font-semibold transition-all group">
              {l.label}
              <span className="absolute bottom-0 right-0 left-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full"
                style={{ backgroundColor: "var(--theme-secondary)" }} />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative flex items-center gap-2 text-white hover:text-[var(--theme-secondary)] transition-colors group">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {mounted && count > 0 && (
                <span className="absolute -top-2 -left-2 bg-[var(--theme-secondary)] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {count}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-medium">السلة</span>
          </Link>

          <Link href="/products"
            className="hidden md:inline-flex px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "var(--theme-secondary)", color: "#000" }}>
            تسوق الآن ✨
          </Link>

          <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-6 py-4 space-y-1"
          style={{ backgroundColor: "var(--theme-primary)" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-white/85 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2.5 text-sm font-medium transition-all">
              {l.label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-white/85 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2.5 text-sm font-medium mt-2 border-t border-white/10 pt-3">
            السلة {mounted && count > 0 && <span className="bg-[var(--theme-secondary)] text-black text-xs font-bold rounded-full px-2">{count}</span>}
          </Link>
        </div>
      )}
    </header>
  );
}
