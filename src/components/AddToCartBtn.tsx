"use client";
import { useCart } from "@/components/CartProvider";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

export function AddToCartBtn({ id, title, price, image }: { id: string; title: string; price: number; image: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const handle = () => {
    addItem({ id, title, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <button onClick={handle}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-[var(--theme-radius)] text-white font-bold text-sm transition-all"
      style={{ backgroundColor: added ? "#16a34a" : "var(--theme-primary)" }}>
      {added ? <><Check className="w-4 h-4" /> تمت الإضافة</> : <><ShoppingCart className="w-4 h-4" /> أضف للسلة</>}
    </button>
  );
}
