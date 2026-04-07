import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

export async function createPreference(
  productId: string,
  productName: string,
  price: number,
  currency: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: productId,
          title: productName,
          quantity: 1,
          unit_price: price,
          currency_id: currency,
        },
      ],
      back_urls: {
        success: `${baseUrl}/exito`,
        failure: `${baseUrl}/#tienda`,
        pending: `${baseUrl}/exito`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhook`,
      metadata: {
        product_id: productId,
      },
    },
  });

  return preference;
}

export async function verifyPayment(paymentId: string) {
  const payment = await paymentClient.get({ id: paymentId });
  return payment;
}
