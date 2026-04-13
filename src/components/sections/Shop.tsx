"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";

function Carousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const lbNext = useCallback(() => {
    setLightbox((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  const lbPrev = useCallback(() => {
    setLightbox((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);

  // Auto-advance (pauses on hover or when lightbox is open)
  useEffect(() => {
    if (hovered || lightbox !== null) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, lightbox, next]);

  // Keyboard + scroll lock for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") lbNext();
      if (e.key === "ArrowLeft") lbPrev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, lbNext, lbPrev]);

  return (
    <>
      {/* Carousel */}
      <div
        className="relative w-full aspect-square bg-paper-light rounded-sm overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
          touchStartX.current = null;
        }}
      >
        {/* Images */}
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0 }}
            onClick={() => setLightbox(i)}
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
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === current ? "bg-white w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox — rendered in document.body via portal to escape any transform ancestor */}
      {lightbox !== null && typeof window !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.93)" }}
          onClick={() => setLightbox(null)}
        >
          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs pointer-events-none"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            {lightbox + 1} / {images.length}
          </div>

          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full px-16 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={`Imagen ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Prev arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); lbPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: "rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="#2D2A26" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); lbNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: "rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="#2D2A26" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: i === lightbox ? "1.5rem" : "0.375rem",
                  backgroundColor: i === lightbox ? "white" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
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
      {/* Promo badge — replaces the tag sticker when there's a discount */}
      {product.originalPrice ? (
        <div className="sticker absolute -top-3 -right-3 bg-blush text-white text-xs font-black px-2.5 py-1.5 rounded-full shadow-md z-10 rotate-12 leading-tight text-center">
          🎉 -50%
        </div>
      ) : product.tag ? (
        <div className="sticker absolute -top-3 -right-3 bg-blush text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 rotate-12">
          {product.tag}
        </div>
      ) : null}

      <Carousel images={product.images} />

      <div className="px-1 pt-3">
        <h3 className="font-serif font-bold text-charcoal text-sm leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted leading-snug mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div>
            {product.originalPrice && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-muted line-through">
                  ${product.originalPrice.toLocaleString("es-AR")}
                </span>
                <span className="text-xs font-bold text-white bg-blush px-1.5 py-0.5 rounded-full leading-tight">
                  -50%
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-black text-lg text-blush">
                ${product.price.toLocaleString("es-AR")}
              </span>
              <span className="text-xs font-normal text-muted">{product.currency}</span>
            </div>
            {product.originalPrice && (
              <p className="text-xs text-muted mt-0.5">✨ Promo lanzamiento</p>
            )}
          </div>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn-primary text-xs px-3 py-1.5 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
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
