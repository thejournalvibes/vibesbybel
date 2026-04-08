import { NextRequest, NextResponse } from "next/server";
import { getSalesCount } from "@/lib/redis";
import { PRODUCTS } from "@/lib/products";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const stats = await Promise.all(
    PRODUCTS.map(async (product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      sales: await getSalesCount(product.id),
      revenue: product.price * (await getSalesCount(product.id)),
    }))
  );

  const totalSales = stats.reduce((acc, p) => acc + p.sales, 0);
  const totalRevenue = stats.reduce((acc, p) => acc + p.revenue, 0);

  return NextResponse.json({ stats, totalSales, totalRevenue });
}
