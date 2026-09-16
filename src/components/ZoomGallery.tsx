"use client";
import { useState } from "react";
import { ZoomIn, ChevronRight, ChevronLeft } from "lucide-react";

export function ZoomGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const imgs = images.length > 0 ? images : ["/placeholder.jpg"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div className="space-y-3">
      {/* Main Image with Zoom */}
      <div
        className="relative w-full aspect-square rounded-[var(--theme-radius)] overflow-hidden border-2 cursor-zoom-in"
        style={{ borderColor: "var(--theme-secondary)" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}>
        <img
          src={imgs[active]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-100"
          style={zoom ? { transform: "scale(2.5)", transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
        />
        {!zoom && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ZoomIn className="w-3 h-3" /> مرر الماوس للتكبير
          </div>
        )}
        {imgs.length > 1 && (
          <>
            <button onClick={() => setActive((a) => (a - 1 + imgs.length) % imgs.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white shadow">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setActive((a) => (a + 1) % imgs.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white shadow">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-[var(--theme-radius)] overflow-hidden border-2 transition-colors ${active === i ? "border-[var(--theme-primary)] shadow-md" : "border-gray-200 hover:border-gray-400"}`}
              style={active === i ? { borderColor: "var(--theme-primary)" } : {}}>
              <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
