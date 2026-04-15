import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/mercadopago";
import { getProductById } from "@/lib/products";
import { markPaymentProcessed, incrementSales, createDownloadToken } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");
    const productId = searchParams.get("product_id");

    if (!paymentId) {
      return NextResponse.json({ error: "payment_id requerido" }, { status: 400 });
    }

    if (!process.env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN.startsWith("your_")) {
      return NextResponse.json({ error: "Configuración incompleta" }, { status: 500 });
    }

    const payment = await verifyPayment(paymentId);

    if (payment.status !== "approved" && payment.status !== "pending") {
      return NextResponse.json({ approved: false, status: payment.status });
    }

    const resolvedProductId =
      (payment.metadata?.product_id as string) || productId;

    if (!resolvedProductId) {
      return NextResponse.json({ error: "Producto no identificado" }, { status: 400 });
    }

    const product = getProductById(resolvedProductId);
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    let downloadToken: string | null = null;

    if (payment.status === "approved") {
      // Track sales idempotently
      const isNew = await markPaymentProcessed(paymentId);
      if (isNew) {
        const amount = (payment.transaction_amount as number) ?? product.price;
        await incrementSales(resolvedProductId, amount);
      }
      // Generate secure one-time download token
      downloadToken = await createDownloadToken(resolvedProductId, product.downloadFile);
    }

    return NextResponse.json({
      approved: payment.status === "approved",
      pending: payment.status === "pending",
      productId: product.id,
      productName: product.name,
      downloadToken,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Error al verificar el pago" }, { status: 500 });
  }
}
