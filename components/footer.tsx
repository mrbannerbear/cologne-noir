import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background-warm text-foreground">
      <div className="mx-auto max-w-360xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="font-display text-2xl tracking-widest font-normal flex items-baseline">
              C<span className="italic text-muted font-normal text-xl -ml-0.5">N</span>
            </div>
            <p className="text-xs leading-relaxed text-muted max-w-xs">
              A boutique storefront presenting hand-selected decants and full bottles. Sourced with integrity, verified with care.
            </p>
          </div>

          {/* Catalog / Navigation */}
          <div className="space-y-3">
            <h4 className="label-caps text-xs text-foreground font-semibold">Storefront</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Authenticity Promise
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com/cologne.noir"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Logistics */}
          <div className="space-y-3">
            <h4 className="label-caps text-xs text-foreground font-semibold">Fulfillment</h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>Cash on Delivery (COD)</li>
              <li>Chittagong: 1–2 Business Days</li>
              <li>Nationwide: 2–5 Business Days</li>
              <li>Manual WhatsApp Verification</li>
            </ul>
          </div>

          {/* Small Print disclaimer */}
          <div className="space-y-3">
            <h4 className="label-caps text-xs text-foreground font-semibold">Inquiries</h4>
            <p className="text-xs leading-relaxed text-muted">
              Have questions about sizing, concentrations, or decanting? Reach out to us directly via Instagram DMs or phone verification.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[10px] text-muted label-caps">
          <p>© {new Date().getFullYear()} Cologne Noir. All rights reserved.</p>
          <div className="flex items-center gap-2 select-none">
            <span>Chittagong</span>
            <span className="h-1.5 w-px bg-border" />
            <span className="italic font-display font-medium text-[11px] tracking-widest lowercase">c/n</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
