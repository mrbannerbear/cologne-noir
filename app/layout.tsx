import type { Metadata } from "next";
import { Suspense } from "react";
import { Bodoni_Moda, Inter, Courier_Prime } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const grainOverlay = <div className="grain-overlay" aria-hidden="true" />;

export const metadata: Metadata = {
  title: "Cologne Noir",
  description:
    "Perfume decants and full bottles from Chittagong. Browse the catalog, order COD, confirm by WhatsApp.",
};

function NavSkeleton() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-360xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="hidden md:flex flex-1 items-center gap-6" />
        <div className="flex md:flex-1 justify-start md:justify-center" />
        <div className="hidden md:flex flex-1 items-center justify-end gap-6" />
        <div className="md:hidden h-8 w-16 border border-border bg-background-warm" />
      </div>
    </header>
  );
}

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
      <body 
        suppressHydrationWarning 
        className="min-h-full flex flex-col relative bg-background text-foreground"
      >
        {grainOverlay}
        
        <Suspense fallback={<NavSkeleton />}>
          <NavBar />
        </Suspense>
        <main className="relative z-10 flex-1 flex flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
