import { Redis } from "@upstash/redis";

// In dev without Redis configured, use a simple in-memory fallback
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
  // Redis not configured, sales tracking will be skipped
}

export async function incrementSales(productId: string): Promise<void> {
  if (!redis) return;
  await redis.incr(`sales:${productId}`);
}

export async function getSalesCount(productId: string): Promise<number> {
  if (!redis) return 0;
  const count = await redis.get<number>(`sales:${productId}`);
  return count ?? 0;
}

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
      JSON.stringify({ productId, downloadFile }),
      { ex: 86400 } // expira en 24 horas
    );
  }
  return token;
}

export async function consumeDownloadToken(
  token: string
): Promise<{ productId: string; downloadFile: string } | null> {
  if (!redis) return null;
  const data = await redis.get<string>(`download:${token}`);
  if (!data) return null;
  // Borra el token para que no se pueda reusar
  await redis.del(`download:${token}`);
  return JSON.parse(data);
}
