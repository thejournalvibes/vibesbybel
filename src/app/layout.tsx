import type { Metadata } from "next";
import { Playfair_Display, Dancing_Script, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Journal Vibes by Bel | Planning & Journaling",
  description:
    "Tu espacio para planear, journalear y vivir más organizada. Descarga recursos gratuitos o explora productos digitales de planning y journaling.",
  keywords: "journaling, planning, bullet journal, organización, plantillas, digitales",
  openGraph: {
    title: "The Journal Vibes by Bel",
    description: "Planning, journaling y organización con estilo ✨",
    type: "website",
    url: "https://vibesbybel.com",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journal Vibes by Bel",
    description: "Planning, journaling y organización con estilo ✨",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dancing.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream">{children}</body>
    </html>
  );
}
