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
  // Returns 1 if key was set (first time), 0 if already exists
  const result = await redis.set(
    `payment:${paymentId}`,
    "processed",
    { nx: true, ex: 86400 * 7 } // expire after 7 days
  );
  return result === "OK";
}
