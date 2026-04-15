"use client";

import { useState } from "react";

interface ProductStat {
  id: string;
  name: string;
  price: number;
  currency: string;
  sales: number;
  revenue: number;
}

interface Stats {
  stats: ProductStat[];
  totalSales: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const fetchStats = async (pwd: string) => {
    const res = await fetch("/api/admin-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (!res.ok) return null;
    return res.json();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const json = await fetchStats(password);
      if (!json) { setError("Contraseña incorrecta 🙅‍♀️"); return; }
      setData(json);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (productId: string, sales: number, revenue: number) => {
    if (!confirm(`¿Segura? Esto sobreescribe los datos de ventas.`)) return;
    setResetMsg("");
    await fetch("/api/admin-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "reset", productId, sales, revenue }),
    });
    const json = await fetchStats(password);
    if (json) setData(json);
    setResetMsg("✅ Datos actualizados");
    setTimeout(() => setResetMsg(""), 3000);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-grid-pink flex items-center justify-center p-6">
        <div className="paper-card p-8 max-w-xs w-full">
          <div className="washi-tape washi-pink absolute -top-2 left-1/2 -translate-x-1/2 w-20" />
          <h1 className="font-script text-3xl text-blush text-center mb-1">
            Panel de Bel
          </h1>
          <p className="text-xs text-muted text-center mb-6">
            Solo para ojos autorizados 🔒
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-blush/30 rounded-xl px-4 py-3 text-sm text-charcoal bg-paper focus:outline-none focus:border-blush"
            />
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-60">
              {loading ? "Verificando..." : "Entrar ✨"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-script text-4xl text-blush mb-1">Panel de ventas</h1>
          <p className="text-sm text-muted">The Journal Vibes by Bel ✨</p>
        </div>

        {/* Totales */}
        <div className="flex gap-3 mb-6">
          <div className="paper-card flex-1 p-4 text-center rotate-1">
            <div className="washi-tape washi-pink w-12 mx-auto mb-2" />
            <p className="text-3xl font-serif font-black text-blush">{data.totalSales}</p>
            <p className="text-xs text-muted mt-1">ventas totales</p>
          </div>
          <div className="paper-card flex-1 p-4 text-center -rotate-1">
            <div className="washi-tape washi-blue w-12 mx-auto mb-2" />
            <p className="text-2xl font-serif font-black text-sky">
              ${data.totalRevenue.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-muted mt-1">ingresos reales</p>
          </div>
        </div>

        {/* Por producto */}
        <h2 className="font-serif font-bold text-charcoal text-lg mb-3">Por producto</h2>
        <div className="flex flex-col gap-3 mb-6">
          {data.stats.map((product) => (
            <div key={product.id} className="paper-card p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blush/10 flex items-center justify-center text-xl flex-shrink-0">
                  📓
                </div>
                <div className="flex-1">
                  <p className="font-serif font-bold text-charcoal text-sm">{product.name}</p>
                  <p className="text-xs text-muted">Precio actual: ${product.price.toLocaleString("es-AR")} {product.currency}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif font-black text-xl text-blush">{product.sales}</p>
                  <p className="text-xs text-muted">ventas</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-blush/10 pt-2">
                <p className="text-xs text-charcoal">
                  Ingresos reales:{" "}
                  <span className="font-bold text-sky">${product.revenue.toLocaleString("es-AR")}</span>
                </p>
                <button
                  onClick={() => handleReset(product.id, 0, 0)}
                  className="text-xs text-muted underline hover:text-blush transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          ))}
        </div>

        {resetMsg && (
          <p className="text-center text-sm text-blush mb-4">{resetMsg}</p>
        )}

        <button
          onClick={() => { setData(null); setPassword(""); }}
          className="btn-secondary w-full text-center"
        >
          Cerrar sesión
        </button>
        <p className="text-center text-xs text-muted mt-4">
          Datos en tiempo real · Revenue calculado al precio de compra 🌙
        </p>
      </div>
    </div>
  );
}
