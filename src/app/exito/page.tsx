"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PaymentResult {
  approved?: boolean;
  pending?: boolean;
  productName?: string;
  downloadToken?: string;
  error?: string;
}

function ExitoContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const productId = searchParams.get("preference_id") || searchParams.get("merchant_order_id");

    if (!paymentId) {
      setResult({ error: "No se encontró información del pago." });
      setLoading(false);
      return;
    }

    fetch(`/api/verify-payment?payment_id=${paymentId}&product_id=${productId || ""}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setResult({ error: "Error al verificar el pago. Contáctame por Instagram." });
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="paper-card text-center p-10">
          <div className="loading-dots mx-auto mb-4" />
          <p className="font-script text-2xl text-blush">Verificando tu pago...</p>
          <p className="text-sm text-muted mt-2">Un momento, por favor 🌸</p>
        </div>
      </div>
    );
  }

  if (result?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <div className="paper-card text-center p-8 max-w-sm">
          <span className="text-4xl mb-4 block">😕</span>
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-3">
            Algo salió mal
          </h1>
          <p className="text-muted text-sm mb-6">{result.error}</p>
          <a href="https://instagram.com/thejournalvibes_" className="btn-primary inline-block">
            Contáctame en Instagram
          </a>
        </div>
      </div>
    );
  }

  if (result?.pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <div className="paper-card text-center p-8 max-w-sm">
          <span className="text-4xl mb-4 block">⏳</span>
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-3">
            Pago en proceso
          </h1>
          <p className="text-muted text-sm mb-6">
            Tu pago está siendo procesado. Te llegará el acceso por email en
            cuanto se confirme. ¡Gracias por tu paciencia!
          </p>
          <Link href="/" className="btn-secondary inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6">
      <div className="paper-card text-center p-8 max-w-sm w-full relative">
        <div className="washi-tape washi-pink absolute -top-2 left-1/2 -translate-x-1/2 w-24" />

        <span className="text-5xl mb-4 block">🎉</span>
        <h1 className="font-script text-3xl text-blush mb-2">¡Muchas gracias!</h1>
        <p className="font-serif text-xl font-bold text-charcoal mb-3">
          {result?.productName || "Tu compra fue exitosa"}
        </p>
        <p className="text-sm text-muted mb-6">
          Ya puedes descargar tu producto. Guardá el archivo en un lugar seguro. 🌸
        </p>

        {result?.downloadToken && (
          <a
            href={`/api/download?token=${result.downloadToken}`}
            className="btn-primary flex items-center justify-center gap-2 mb-4 w-full"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Descargar ahora</span>
          </a>
        )}

        <Link href="/#tienda" className="btn-secondary block w-full text-center">
          Volver a la tienda
        </Link>

        <p className="text-xs text-muted mt-6">
          ⚠️ El link de descarga expira en 24hs.{" "}
          <a href="https://instagram.com/thejournalvibes_" className="text-blush underline">
            ¿Problemas? Escribime en Instagram
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-script text-2xl text-blush">Cargando...</p>
      </div>
    }>
      <ExitoContent />
    </Suspense>
  );
}
