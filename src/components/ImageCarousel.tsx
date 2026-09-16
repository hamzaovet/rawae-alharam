"use client";

import { useState, useEffect, useCallback } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  autoPlayInterval?: number;
};

export function ImageCarousel({ images, alt, className = "", autoPlayInterval = 3000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const count = images.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || isHovered) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [count, isHovered, next, autoPlayInterval]);

  if (!images || count === 0) return null;
  if (count === 1) {
    return (
      <div className={className}>
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${alt} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* Prev/Next arrows (shown on hover) */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
        aria-label="السابق"
      >
        ›
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/60"
        aria-label="التالي"
      >
        ‹
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`الصورة ${i + 1}`}
          />
        ))}
      </div>

      {/* Image counter badge */}
      {count > 1 && (
        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {current + 1}/{count}
        </div>
      )}
    </div>
  );
}
