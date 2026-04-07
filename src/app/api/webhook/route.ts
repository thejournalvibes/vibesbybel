import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/mercadopago";
import { incrementSales, markPaymentProcessed } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mercado Pago sends different notification types
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id?.toString();
    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const payment = await verifyPayment(paymentId);

    if (payment.status === "approved") {
      const productId = payment.metadata?.product_id as string;
      if (productId) {
        // Idempotent: only count once per payment
        const isNew = await markPaymentProcessed(paymentId);
        if (isNew) {
          await incrementSales(productId);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to MP
  }
}
