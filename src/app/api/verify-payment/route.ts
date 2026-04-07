import { NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "@/lib/mercadopago";
import { getProductById } from "@/lib/products";
import { markPaymentProcessed, incrementSales } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");
    const productId = searchParams.get("product_id");

    if (!paymentId) {
      return NextResponse.json({ error: "payment_id requerido" }, { status: 400 });
    }

    // Demo mode
    if (paymentId.startsWith("DEMO_")) {
      const demoProductId = paymentId.replace("DEMO_", "");
      const product = getProductById(demoProductId);
      if (product) {
        return NextResponse.json({
          approved: true,
          productId: product.id,
          productName: product.name,
          downloadUrl: product.downloadFile,
        });
      }
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

    // Track sales idempotently
    if (payment.status === "approved") {
      const isNew = await markPaymentProcessed(paymentId);
      if (isNew) {
        await incrementSales(resolvedProductId);
      }
    }

    return NextResponse.json({
      approved: payment.status === "approved",
      pending: payment.status === "pending",
      productId: product.id,
      productName: product.name,
      downloadUrl: payment.status === "approved" ? product.downloadFile : null,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Error al verificar el pago" }, { status: 500 });
  }
}
