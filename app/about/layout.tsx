import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Cologne Noir is an Instagram-first perfume business in based in Bangladesh — authentic decants and full bottles, shipped nationwide via cash on delivery and verified personally by phone or WhatsApp.",
  alternates: {
    canonical: "https://colognenoir.com/about",
  },
  openGraph: {
    title: "About Us — Cologne Noir",
    description:
      "Authentic perfume decants and full bottles, Bangladesh-based. Nationwide COD with manual phone / WhatsApp verification on every order.",
    url: "https://colognenoir.com/about",
    siteName: "Cologne Noir",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us — Cologne Noir",
    description:
      "Authentic perfume decants and full bottles, Bangladesh-based. Nationwide COD with manual phone / WhatsApp verification on every order.",
  },
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}