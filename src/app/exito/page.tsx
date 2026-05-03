"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
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
  const [copied, setCopied] = useState(false);

  const downloadUrl = result?.downloadToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/api/download?token=${result.downloadToken}`
    : null;

  const handleCopy = useCallback(() => {
    if (!downloadUrl) return;
    navigator.clipboard.writeText(downloadUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }, [downloadUrl]);

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

        {/* ── Warning banner ── */}
        {result?.downloadToken && (
          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 px-4 py-3 mb-5 text-left">
            <p className="font-bold text-amber-800 text-sm mb-1">
              ⚠️ Guardá este link antes de cerrar
            </p>
            <p className="text-amber-700 text-xs leading-snug mb-3">
              El link expira en <strong>24 horas</strong> y solo funciona una vez.
              Si cerrás esta página sin descargarlo, perdés el acceso.
            </p>
            <button
              onClick={handleCopy}
              className={`w-full rounded-xl py-2 px-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-amber-400 hover:bg-amber-500 text-amber-900"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Copiado!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar link
                </>
              )}
            </button>
          </div>
        )}

        <p className="text-sm text-muted mb-4">
          Tu plantilla está lista. Hacé clic para abrirla en Google Drive. 🌸
        </p>

        {result?.downloadToken && (
          <a
            href={`/api/download?token=${result.downloadToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2 mb-4 w-full"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Abrir mi plantilla</span>
          </a>
        )}

        <Link href="/#tienda" className="btn-secondary block w-full text-center">
          Volver a la tienda
        </Link>

        <p className="text-xs text-muted mt-5">
          ¿Problemas?{" "}
          <a href="https://instagram.com/thejournalvibes_" className="text-blush underline">
            Escribime en Instagram
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
