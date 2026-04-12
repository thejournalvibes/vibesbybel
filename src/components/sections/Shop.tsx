"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";

function Carousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (hovered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, next]);

  return (
    <div
      className="relative w-full aspect-square bg-paper-light rounded-sm overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Images */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Imagen ${i + 1}`}
            fill
            className={i === images.length - 1 ? "object-contain" : "object-cover"}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Arrows — visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className={`
          absolute left-2 top-1/2 -translate-y-1/2 z-10
          w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm
          flex items-center justify-center shadow-md
          transition-opacity duration-200
          ${hovered ? "opacity-100" : "opacity-0"}
        `}
        aria-label="Anterior"
      >
        <svg className="w-4 h-4 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2 z-10
          w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm
          flex items-center justify-center shadow-md
          transition-opacity duration-200
          ${hovered ? "opacity-100" : "opacity-0"}
        `}
        aria-label="Siguiente"
      >
        <svg className="w-4 h-4 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              i === current ? "bg-white w-3" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: (typeof PRODUCTS)[0]; index: number }) {
  const [loading, setLoading] = useState(false);
  const rotations = ["-rotate-1", "rotate-1"];

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Hubo un error al procesar el pago. Intenta de nuevo.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`polaroid ${rotations[index % 2]} group w-full`}>
      {product.tag && (
        <div className="sticker absolute -top-3 -right-3 bg-blush text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 rotate-12">
          {product.tag}
        </div>
      )}

      <Carousel images={product.images} />

      <div className="px-1 pt-3">
        <h3 className="font-serif font-bold text-charcoal text-sm leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted leading-snug mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-serif font-black text-lg text-blush">
            ${product.price}
            <span className="text-xs font-normal text-muted ml-1">{product.currency}</span>
          </span>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn-primary text-xs px-3 py-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Comprar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <section id="tienda" className="py-10 px-4 bg-cream relative overflow-hidden">
      <span className="absolute top-6 right-4 text-3xl rotate-12 opacity-60">✂️</span>
      <span className="absolute bottom-10 left-2 text-2xl -rotate-12 opacity-40">📎</span>

      <div className="container mx-auto max-w-sm">
        <div className="text-center mb-8">
          <div className="paper-torn inline-block px-6 py-3 mb-2">
            <span className="text-xl mr-2">🛍️</span>
            <h2 className="font-serif text-2xl font-bold text-charcoal inline">
              La Tienda
            </h2>
          </div>
          <p className="text-sm text-muted">
            Productos digitales para tu planning y journaling ✨
          </p>
          <div className="washi-tape washi-blue mx-auto mt-2 w-32 h-4 opacity-60" />
        </div>

        <div className="flex flex-col gap-8">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="paper-card mt-8 p-4 text-center">
          <p className="text-xs text-muted leading-relaxed">
            💳 Pago seguro con Mercado Pago · Descarga inmediata al acreditarse el pago
          </p>
        </div>
      </div>
    </section>
  );
}
