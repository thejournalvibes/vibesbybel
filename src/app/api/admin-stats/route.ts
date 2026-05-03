import { NextRequest, NextResponse } from "next/server";
import {
  getSalesCount,
  getRevenue,
  resetSalesData,
  getSalesHistory,
  clearAllSalesHistory,
  recordManualSale,
  setFreeLink,
  getAllFreeLinks,
} from "@/lib/redis";
import { PRODUCTS, FREE_DOWNLOADS } from "@/lib/products";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, action } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Reset a single product's counters
  if (action === "reset") {
    const { productId, sales, revenue } = body;
    await resetSalesData(productId, sales ?? 0, revenue ?? 0);
    return NextResponse.json({ ok: true });
  }

  // Update a free download link
  if (action === "setLink") {
    const { productId, url } = body;
    await setFreeLink(productId, url);
    return NextResponse.json({ ok: true });
  }

  // Clear entire sales history sorted set
  if (action === "clearHistory") {
    await clearAllSalesHistory();
    return NextResponse.json({ ok: true });
  }

  // Seed a real historical sale manually
  if (action === "seedSale") {
    const { entry } = body; // SaleEntry shape
    await recordManualSale(entry);
    return NextResponse.json({ ok: true });
  }

  // Return stats + history + free links
  const freeIds = FREE_DOWNLOADS.map((d) => d.id);
  const [stats, history, linkOverrides] = await Promise.all([
    Promise.all(
      PRODUCTS.map(async (product) => {
        const sales = await getSalesCount(product.id);
        const revenue = await getRevenue(product.id);
        return { id: product.id, name: product.name, price: product.price, currency: product.currency, sales, revenue };
      })
    ),
    getSalesHistory(),
    getAllFreeLinks(freeIds),
  ]);

  // Build free downloads list with current effective link
  const freeLinks = FREE_DOWNLOADS.map((d) => ({
    id: d.id,
    name: d.name,
    currentLink: linkOverrides[d.id] ?? d.downloadFile,
    isOverridden: !!linkOverrides[d.id],
  }));

  const totalSales = stats.reduce((acc, p) => acc + p.sales, 0);
  const totalRevenue = stats.reduce((acc, p) => acc + p.revenue, 0);

  return NextResponse.json({ stats, totalSales, totalRevenue, history, freeLinks });
}
