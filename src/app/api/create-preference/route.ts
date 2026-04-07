import { NextRequest, NextResponse } from "next/server";
import { createPreference } from "@/lib/mercadopago";
import { getProductById } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId es requerido" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    if (!product || product.category === "free") {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    if (!process.env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN.startsWith("your_")) {
      // Demo mode: return a mock init_point for development
      return NextResponse.json({
        init_point: `${process.env.NEXT_PUBLIC_BASE_URL}/exito?payment_id=DEMO_${productId}&status=approved`,
      });
    }

    const preference = await createPreference(
      product.id,
      product.name,
      product.price,
      product.currency
    );

    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
