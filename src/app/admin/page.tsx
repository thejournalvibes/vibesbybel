"use client";

import { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/products";

interface ProductStat {
  id: string;
  name: string;
  price: number;
  currency: string;
  sales: number;
  revenue: number;
}

interface SaleEntry {
  paymentId: string;
  productId: string;
  productName: string;
  amount: number;
  timestamp: number;
}

interface FreeLink {
  id: string;
  name: string;
  currentLink: string;
  isOverridden: boolean;
}

interface Stats {
  stats: ProductStat[];
  totalSales: number;
  totalRevenue: number;
  history: SaleEntry[];
  freeLinks: FreeLink[];
}

type Period = "week" | "month" | "all";

function fmt(n: number) {
  return n.toLocaleString("es-AR");
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function startOf(period: Period): number {
  const now = new Date();
  if (period === "week") {
    const d = new Date(now); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d.getTime();
  }
  if (period === "month") {
    const d = new Date(now); d.setDate(d.getDate() - 29); d.setHours(0, 0, 0, 0); return d.getTime();
  }
  return 0;
}

function groupByDay(entries: SaleEntry[]): { label: string; sales: number; revenue: number }[] {
  const map: Record<string, { sales: number; revenue: number }> = {};
  for (const e of entries) {
    const key = new Date(e.timestamp).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    if (!map[key]) map[key] = { sales: 0, revenue: 0 };
    map[key].sales += 1;
    map[key].revenue += e.amount;
  }
  return Object.entries(map)
    .sort((a, b) => {
      // sort by date (dd/mm)
      const [da, ma] = a[0].split("/").map(Number);
      const [db, mb] = b[0].split("/").map(Number);
      return ma !== mb ? ma - mb : da - db;
    })
    .map(([label, v]) => ({ label, ...v }));
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"overview" | "history" | "links">("overview");
  const [editLinks, setEditLinks] = useState<Record<string, string>>({});
  const [savingLink, setSavingLink] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("week");
  const [msg, setMsg] = useState("");
  const [seeding, setSeeding] = useState(false);
  // Manual seed form
  const [seedProduct, setSeedProduct] = useState(PRODUCTS[0].id);
  const [seedAmount, setSeedAmount] = useState("7500");
  const [seedDate, setSeedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const api = async (body: object) => {
    const res = await fetch("/api/admin-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...body }),
    });
    if (!res.ok) return null;
    return res.json();
  };

  const refresh = async () => {
    const json = await api({});
    if (json) setData(json);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const json = await api({});
    if (!json) { setError("Contraseña incorrecta 🙅‍♀️"); }
    else setData(json);
    setLoading(false);
  };

  const handleReset = async (productId: string) => {
    if (!confirm("¿Limpiar datos de este producto?")) return;
    await api({ action: "reset", productId, sales: 0, revenue: 0 });
    await api({ action: "clearHistory" });
    await refresh();
    flash("✅ Datos limpiados");
  };

  const handleSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeeding(true);
    const product = PRODUCTS.find(p => p.id === seedProduct)!;
    const ts = new Date(seedDate + "T12:00:00").getTime();
    await api({
      action: "seedSale",
      entry: {
        paymentId: `manual-${Date.now()}`,
        productId: seedProduct,
        productName: product.name,
        amount: Number(seedAmount),
        timestamp: ts,
      },
    });
    await refresh();
    setSeeding(false);
    flash("✅ Venta registrada");
  };

  const handleSaveLink = async (id: string) => {
    const url = editLinks[id]?.trim();
    if (!url) return;
    setSavingLink(id);
    await api({ action: "setLink", productId: id, url });
    await refresh();
    setSavingLink(null);
    flash("✅ Link actualizado");
  };

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (!data) return [];
    const from = startOf(period);
    return data.history.filter(e => e.timestamp >= from).sort((a, b) => b.timestamp - a.timestamp);
  }, [data, period]);

  const grouped = useMemo(() => groupByDay(filteredHistory), [filteredHistory]);
  const maxRevenue = Math.max(...grouped.map(g => g.revenue), 1);
  const periodRevenue = filteredHistory.reduce((s, e) => s + e.amount, 0);

  if (!data) {
    return (
      <div className="min-h-screen bg-grid-pink flex items-center justify-center p-6">
        <div className="paper-card p-8 max-w-xs w-full">
          <h1 className="font-script text-3xl text-blush text-center mb-1">Panel de Bel</h1>
          <p className="text-xs text-muted text-center mb-6">Solo para ojos autorizados 🔒</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="password" placeholder="Contraseña" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-blush/30 rounded-xl px-4 py-3 text-sm text-charcoal bg-paper focus:outline-none focus:border-blush" />
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
    <div className="min-h-screen bg-cream p-5">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-script text-4xl text-blush mb-1">Panel de ventas</h1>
          <p className="text-xs text-muted">The Journal Vibes by Bel ✨</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["overview", "history", "links"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-serif font-bold transition-colors ${tab === t ? "bg-blush text-white" : "bg-paper text-muted shadow-paper"}`}>
              {t === "overview" ? "📊 Resumen" : t === "history" ? "📅 Historial" : "🔗 Links"}
            </button>
          ))}
        </div>

        {msg && <p className="text-center text-sm text-blush mb-4">{msg}</p>}

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <>
            <div className="flex gap-3 mb-5">
              <div className="paper-card flex-1 p-4 text-center rotate-1">
                <div className="washi-tape washi-pink w-10 mx-auto mb-2 h-3" />
                <p className="text-3xl font-serif font-black text-blush">{data.totalSales}</p>
                <p className="text-xs text-muted mt-1">ventas totales</p>
              </div>
              <div className="paper-card flex-1 p-4 text-center -rotate-1">
                <div className="washi-tape washi-blue w-10 mx-auto mb-2 h-3" />
                <p className="text-xl font-serif font-black text-sky">${fmt(data.totalRevenue)}</p>
                <p className="text-xs text-muted mt-1">ingresos reales</p>
              </div>
            </div>

            <h2 className="font-serif font-bold text-charcoal mb-3">Por producto</h2>
            <div className="flex flex-col gap-3 mb-6">
              {data.stats.map(p => (
                <div key={p.id} className="paper-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">📓</span>
                    <div className="flex-1">
                      <p className="font-serif font-bold text-charcoal text-sm">{p.name}</p>
                      <p className="text-xs text-muted">Precio actual: ${fmt(p.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-black text-xl text-blush">{p.sales}</p>
                      <p className="text-xs text-muted">ventas</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-blush/10 pt-2">
                    <p className="text-xs text-charcoal">
                      Ingresos: <span className="font-bold text-sky">${fmt(p.revenue)}</span>
                    </p>
                    <button onClick={() => handleReset(p.id)}
                      className="text-xs text-muted underline hover:text-blush transition-colors">
                      Limpiar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Seed form */}
            <div className="paper-card p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-8 washi-tape washi-pink opacity-70 rounded-sm" />
                <h3 className="font-serif font-bold text-charcoal text-sm">Registrar venta manual</h3>
              </div>
              <form onSubmit={handleSeed} className="flex flex-col gap-2">
                <select value={seedProduct} onChange={e => setSeedProduct(e.target.value)}
                  className="border border-blush/30 rounded-lg px-3 py-2 text-sm text-charcoal bg-paper">
                  {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="number" value={seedAmount} onChange={e => setSeedAmount(e.target.value)}
                    placeholder="Monto $" className="flex-1 border border-blush/30 rounded-lg px-3 py-2 text-sm text-charcoal bg-paper" />
                  <input type="date" value={seedDate} onChange={e => setSeedDate(e.target.value)}
                    className="flex-1 border border-blush/30 rounded-lg px-3 py-2 text-sm text-charcoal bg-paper" />
                </div>
                <button type="submit" disabled={seeding}
                  className="btn-primary text-sm py-2 disabled:opacity-60">
                  {seeding ? "Guardando..." : "Guardar venta ✨"}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <>
            {/* Period selector */}
            <div className="flex gap-2 mb-5">
              {(["week", "month", "all"] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === p ? "bg-blush text-white" : "bg-paper text-muted shadow-paper"}`}>
                  {p === "week" ? "7 días" : p === "month" ? "30 días" : "Todo"}
                </button>
              ))}
            </div>

            {/* Period summary */}
            <div className="paper-card p-4 text-center mb-5 -rotate-1">
              <p className="text-2xl font-serif font-black text-sky">${fmt(periodRevenue)}</p>
              <p className="text-xs text-muted">{filteredHistory.length} venta{filteredHistory.length !== 1 ? "s" : ""} en el período</p>
            </div>

            {/* Bar chart */}
            {grouped.length > 0 ? (
              <div className="paper-card p-4 mb-5">
                <p className="font-serif font-bold text-charcoal text-sm mb-3">Ingresos por día</p>
                <div className="flex flex-col gap-2">
                  {grouped.map(g => (
                    <div key={g.label} className="flex items-center gap-2">
                      <span className="text-xs text-muted w-10 flex-shrink-0">{g.label}</span>
                      <div className="flex-1 h-5 bg-blush/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blush rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(8, (g.revenue / maxRevenue) * 100)}%` }}
                        >
                          <span className="text-white text-xs font-bold leading-none" style={{ fontSize: "0.6rem" }}>
                            ${fmt(g.revenue)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted w-4 flex-shrink-0">{g.sales}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="paper-card p-6 text-center mb-5">
                <p className="text-muted text-sm">Sin ventas en este período 🌸</p>
              </div>
            )}

            {/* Sale list */}
            {filteredHistory.length > 0 && (
              <div className="flex flex-col gap-2 mb-5">
                <h3 className="font-serif font-bold text-charcoal text-sm">Detalle</h3>
                {filteredHistory.map((e, i) => (
                  <div key={i} className="paper-card px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-charcoal">{e.productName}</p>
                      <p className="text-xs text-muted">{fmtDate(e.timestamp)}</p>
                    </div>
                    <span className="font-serif font-black text-blush">${fmt(e.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── LINKS ── */}
        {tab === "links" && (
          <div className="flex flex-col gap-3 mb-5">
            <p className="text-xs text-muted mb-1">
              Subí el archivo a Google Drive → compartir → "Cualquier persona con el enlace" → pegá el link acá 👇
            </p>
            {data.freeLinks.map((item) => (
              <div key={item.id} className="paper-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-serif font-bold text-charcoal text-sm flex-1">{item.name}</p>
                  {item.isOverridden && (
                    <span className="text-xs bg-blush/15 text-blush px-2 py-0.5 rounded-full">editado</span>
                  )}
                </div>
                <p className="text-xs text-muted mb-2 break-all">
                  {item.currentLink}
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Pegá el nuevo link de Drive..."
                    value={editLinks[item.id] ?? ""}
                    onChange={(e) => setEditLinks(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="flex-1 border border-blush/30 rounded-lg px-3 py-2 text-xs text-charcoal bg-paper focus:outline-none focus:border-blush"
                  />
                  <button
                    onClick={() => handleSaveLink(item.id)}
                    disabled={!editLinks[item.id]?.trim() || savingLink === item.id}
                    className="btn-primary text-xs px-3 py-2 disabled:opacity-40"
                  >
                    {savingLink === item.id ? "..." : "Guardar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => { setData(null); setPassword(""); }} className="btn-secondary w-full text-center mt-2">
          Cerrar sesión
        </button>
        <p className="text-center text-xs text-muted mt-3">Revenue al precio real de compra 🌙</p>
      </div>
    </div>
  );
}
