import { NextRequest, NextResponse } from "next/server";
import { getSalesCount, getRevenue, resetSalesData } from "@/lib/redis";
import { PRODUCTS } from "@/lib/products";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, action } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Reset sales data for a product
  if (action === "reset") {
    const { productId, sales, revenue } = body;
    await resetSalesData(productId, sales ?? 0, revenue ?? 0);
    return NextResponse.json({ ok: true });
  }

  // Default: return stats
  const stats = await Promise.all(
    PRODUCTS.map(async (product) => {
      const sales = await getSalesCount(product.id);
      const revenue = await getRevenue(product.id);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        sales,
        revenue,
      };
    })
  );

  const totalSales = stats.reduce((acc, p) => acc + p.sales, 0);
  const totalRevenue = stats.reduce((acc, p) => acc + p.revenue, 0);

  return NextResponse.json({ stats, totalSales, totalRevenue });
}
