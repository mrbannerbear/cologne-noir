import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Courier_Prime } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";

const bodoniModa = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const courierPrime = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cologne Noir",
  description:
    "Perfume decants and full bottles from Chittagong. Browse the catalog, order COD, confirm by WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        bodoniModa.variable,
        inter.variable,
        courierPrime.variable
      )}
    >
      <body className="min-h-full flex flex-col relative bg-background text-foreground">
        {/* Grain overlay for desaturated film look */}
        <div className="grain-overlay" aria-hidden="true" />
        
        <NavBar />
        <main className="relative z-10 flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
