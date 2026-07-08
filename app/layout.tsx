import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cologne Noir",
  description:
    "A monochrome catalog and order-intake experience for perfume decants and full bottles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(17,17,17,0.05),transparent_52%)]" />
        <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-black/90">
                Cologne Noir
              </span>
              <span className="hidden text-xs uppercase tracking-[0.32em] text-black/40 sm:inline">
                perfume catalog
              </span>
            </Link>
            <nav className="flex items-center gap-2 text-sm text-black/70">
              <Link
                href="/products"
                className="rounded-full border border-black/8 bg-white/80 px-4 py-2 backdrop-blur-md transition hover:border-black/15 hover:bg-white hover:text-black"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-black/8 px-4 py-2 text-black/70 transition hover:border-black/15 hover:bg-black/3 hover:text-black"
              >
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 border-t border-black/5 bg-white/65">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-8 text-sm text-black/48 sm:px-6 lg:grid-cols-2 lg:px-8">
            <p>
              Chittagong-based perfume catalog with COD-only orders and manual WhatsApp confirmation.
            </p>
            <p className="lg:text-right">Built for phone-first discovery, negative space, and liquid CTA surfaces.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
