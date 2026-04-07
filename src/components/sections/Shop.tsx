"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCTS } from "@/lib/products";

function ProductCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  const [loading, setLoading] = useState(false);

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
    <div className="polaroid -rotate-1 group mx-auto max-w-xs w-full">
      {product.tag && (
        <div className="sticker absolute -top-3 -right-3 bg-blush text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 rotate-12">
          {product.tag}
        </div>
      )}

      <div className="relative w-full aspect-square bg-paper-light rounded-sm overflow-hidden mb-3">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-blush/20">
            <span className="text-5xl">📓</span>
          </div>
        )}
      </div>

      <div className="px-1">
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

        <div className="flex flex-col gap-6 items-center">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
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
