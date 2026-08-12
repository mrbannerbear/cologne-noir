import type { Metadata } from "next";
import { Suspense } from "react";
import { Bodoni_Moda, Inter, Courier_Prime } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { ScrollToTop } from "@/components/scroll-to-top";
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
  metadataBase: new URL("https://colognenoir.com"),
  title: {
    default: "Cologne Noir",
    template: "%s | Cologne Noir",
  },
  description:
    "Perfume decants and full bottles, Bangladesh-based. Browse the catalog, order COD, confirm by WhatsApp.",
  openGraph: {
    siteName: "Cologne Noir",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function NavSkeleton() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-360 items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="hidden lg:flex flex-1 items-center gap-6">
          <span className="h-3 w-10 bg-border/60" />
          <span className="h-3 w-14 bg-border/60" />
          <span className="h-3 w-8 bg-border/60" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="w-24 md:w-30 lg:w-35 aspect-[7/2] bg-background-warm" />
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-end gap-6">
          <span className="h-3 w-12 bg-border/60" />
          <span className="h-3 w-px bg-border/60" />
          <span className="h-3 w-16 bg-border/60" />
        </div>
        <div className="lg:hidden h-10 w-10 border border-border bg-background-warm" />
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
        className="min-h-svh flex flex-col relative bg-background text-foreground"
      >
        {grainOverlay}
        <ScrollToTop />

        <Suspense fallback={<NavSkeleton />}>
          <NavBar />
        </Suspense>
        <main className="relative z-10 flex-1 flex flex-col">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
