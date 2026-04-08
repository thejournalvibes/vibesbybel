import { NextRequest, NextResponse } from "next/server";
import { consumeDownloadToken } from "@/lib/redis";
import { getProductById } from "@/lib/products";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const tokenData = await consumeDownloadToken(token);

  if (!tokenData) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;text-align:center;padding:40px">
        <h2>🔒 Link expirado o inválido</h2>
        <p>Este link de descarga ya fue usado o expiró.</p>
        <p>Si acabas de pagar, <a href="https://instagram.com/thejournalvibes_">contáctanos en Instagram</a>.</p>
      </body></html>`,
      { status: 410, headers: { "Content-Type": "text/html" } }
    );
  }

  const product = getProductById(tokenData.productId);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  // Servir el archivo desde /public/downloads/
  const filePath = path.join(process.cwd(), "public", tokenData.downloadFile);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(tokenData.downloadFile);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "application/octet-stream",
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
