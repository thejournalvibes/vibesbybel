import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

try {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    !process.env.UPSTASH_REDIS_REST_URL.startsWith("your_")
  ) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch {
  // Redis not configured
}

export interface SaleEntry {
  paymentId: string;
  productId: string;
  productName: string;
  amount: number;
  timestamp: number; // Unix ms
}

// ─── Counters (totals) ───────────────────────────────────────────────────────

export async function incrementSales(
  productId: string,
  amount: number,
  entry: Omit<SaleEntry, "timestamp">
): Promise<void> {
  if (!redis) return;
  const ts = Date.now();
  await Promise.all([
    redis.incr(`sales:${productId}`),
    redis.incrbyfloat(`revenue:${productId}`, amount),
    // Store in sorted set with timestamp as score for history queries
    redis.zadd("sales_history", { score: ts, member: JSON.stringify({ ...entry, timestamp: ts }) }),
  ]);
}

export async function getSalesCount(productId: string): Promise<number> {
  if (!redis) return 0;
  const count = await redis.get<number>(`sales:${productId}`);
  return count ?? 0;
}

export async function getRevenue(productId: string): Promise<number> {
  if (!redis) return 0;
  const rev = await redis.get<number>(`revenue:${productId}`);
  return rev ?? 0;
}

export async function resetSalesData(
  productId: string,
  sales: number,
  revenue: number
): Promise<void> {
  if (!redis) return;
  await redis.set(`sales:${productId}`, sales);
  await redis.set(`revenue:${productId}`, revenue);
}

// ─── Sales history ───────────────────────────────────────────────────────────

export async function getSalesHistory(
  fromTs = 0,
  toTs = Date.now()
): Promise<SaleEntry[]> {
  if (!redis) return [];
  const raw = await redis.zrange<string[]>("sales_history", fromTs, toTs, {
    byScore: true,
  });
  if (!raw?.length) return [];
  return raw.map((r) => {
    try {
      return typeof r === "string" ? JSON.parse(r) : r;
    } catch {
      return null;
    }
  }).filter(Boolean) as SaleEntry[];
}

export async function clearAllSalesHistory(): Promise<void> {
  if (!redis) return;
  await redis.del("sales_history");
}

// Manually inject a sale entry (for seeding real historical data)
export async function recordManualSale(entry: SaleEntry): Promise<void> {
  if (!redis) return;
  await redis.zadd("sales_history", {
    score: entry.timestamp,
    member: JSON.stringify(entry),
  });
  await redis.set(`sales:${entry.productId}`, 1);
  await redis.set(`revenue:${entry.productId}`, entry.amount);
}

// ─── Free download link overrides ────────────────────────────────────────────

export async function setFreeLink(productId: string, url: string): Promise<void> {
  if (!redis) return;
  await redis.set(`freelink:${productId}`, url);
}

export async function getAllFreeLinks(ids: string[]): Promise<Record<string, string>> {
  if (!redis) return {};
  const values = await Promise.all(ids.map((id) => redis!.get<string>(`freelink:${id}`)));
  const result: Record<string, string> = {};
  ids.forEach((id, i) => { if (values[i]) result[id] = values[i]!; });
  return result;
}

// ─── Payments & tokens ───────────────────────────────────────────────────────

export async function markPaymentProcessed(paymentId: string): Promise<boolean> {
  if (!redis) return false;
  const result = await redis.set(
    `payment:${paymentId}`,
    "processed",
    { nx: true, ex: 86400 * 7 }
  );
  return result === "OK";
}

export async function createDownloadToken(
  productId: string,
  downloadFile: string
): Promise<string> {
  const token = crypto.randomUUID();
  if (redis) {
    await redis.set(
      `download:${token}`,
      { productId, downloadFile },
      { ex: 86400 }
    );
  }
  return token;
}

export async function consumeDownloadToken(
  token: string
): Promise<{ productId: string; downloadFile: string } | null> {
  if (!redis) return null;
  const data = await redis.get<{ productId: string; downloadFile: string }>(
    `download:${token}`
  );
  if (!data) return null;
  await redis.del(`download:${token}`);
  return data;
}
