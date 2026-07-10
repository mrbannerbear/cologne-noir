# UI/UX Design System

## Direction (replaces the earlier "liquid glass" spec)
Editorial, French-perfumery-house aesthetic — think a print magazine spread more than an app.
Reference points: split-screen photographic heroes, high-contrast serif wordmarks, hairline
rules instead of borders/shadows, torn-paper and polaroid-stack collage moments reserved for
storytelling sections, and a slightly desaturated, "hazy" film-grain quality across photography.
Calm and confident rather than flashy — nothing bounces, nothing glows. The previous glass
system (blur, spring animations, rounded pill CTAs) is fully retired; this is closer to print
design translated to the web than to a typical SaaS/app UI.

## Color palette (warm monochrome — not pure black/white)

| Token | Value | Use |
|---|---|---|
| `--background` | `#FFFFFF` | Default page background (catalog, product pages) |
| `--background-warm` | `#F6F4EF` | Off-white/cream — storytelling sections, cards, form backgrounds |
| `--surface-paper` | `#EAE6DC` | Warm grey-beige "paper" texture backgrounds (newsletter, collage sections) |
| `--foreground` | `#181818` | Primary text — soft black, not pure `#000` |
| `--muted` | `#6E6B64` | Secondary text, captions, note labels |
| `--border` | `#D9D5C9` | Hairline rules — the primary structural device, replaces cards/shadows |
| `--ink` | `#000000` | Reserved for solid CTA fills and the wordmark only |

No blue, no gold, no saturated accent color anywhere. Where the reference images show a hint of
warmth (cream envelope paper, beige postcard), that warmth comes from `--background-warm` and
`--surface-paper`, not from a color accent — the palette stays achromatic/warm-neutral throughout.

## The "hazy" texture layer
Add a fixed, page-wide film-grain overlay so photography and flat color fields feel like they
belong to the same slightly-textured world, rather than crisp separated to a decorative image:

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  opacity: 0.035;
  mix-blend-mode: overlay;
  background-image: url('/noise.png'); /* small tiling grain texture, or an inline SVG turbulence filter */
  background-repeat: repeat;
}
```
Keep the opacity very low (3–5%) — the goal is a barely-there quality, not a visible filter.

**Photography note (content, not code):** the reference direction leans on clean, light-background
product shots (image on white/cream) plus separate moody black-and-white lifestyle/scene
photography for storytelling sections. Your current IG catalog photos are shot on a dark
background — worth re-shooting key hero/catalog images on a neutral light backdrop to match this
direction; a CSS filter can nudge consistency (`filter: grayscale(10%) contrast(105%)` on
lifestyle images) but can't fix a fundamentally dark-background product photo. Flag this as a
content task alongside the build, not something to solve in code.

## Typography
- **Display serif (wordmark, big headlines):** `Bodoni Moda` (Google Fonts) — high-contrast,
  tall, classic Didone serif, matches the "ST. ROSE" wordmark and large editorial headlines
  in the reference. Use at light/regular weight, generous letter-spacing on the wordmark itself.
- **Body / UI / nav:** `Inter`, used sparingly and quietly — small size, uppercase, wide
  letter-spacing (`tracking-[0.15em]`) for nav links and labels ("CATALOG", "ABOUT US",
  "SEARCH"). This is the workhorse text; keep it out of the spotlight, let the serif carry
  personality.
- **Editorial/mono accent:** `Courier Prime` (Google Fonts) — used sparingly for captions,
  placeholder/lorem-style copy, price labels in some contexts, or small print. This is what
  gives the "zine/collage" texture in the postcard reference. Don't use it for primary UI text
  — it's a seasoning, not a base font.
- Headings are light/regular weight, never bold — bold Didone serifs at display size read
  heavy and cheap. Size and spacing carry hierarchy, not weight.

## Config note (Tailwind v4)
Declare tokens in `app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-background: #FFFFFF;
  --color-background-warm: #F6F4EF;
  --color-surface-paper: #EAE6DC;
  --color-foreground: #181818;
  --color-muted: #6E6B64;
  --color-border: #D9D5C9;
  --color-ink: #000000;
  --font-display: "Bodoni Moda", serif;
  --font-sans: "Inter", sans-serif;
  --font-mono: "Courier Prime", monospace;
}
```

**shadcn preset correction:** we initialized with the **Maia** preset (soft, rounded corners) —
that was chosen for the earlier glass-pill direction and no longer fits. This new direction
wants **sharp, mostly-zero-radius rectangles** (see the buttons below). Rather than re-running
`shadcn init`, just override the radius token directly:
```css
@theme {
  --radius: 0.125rem; /* effectively square — 2px, not fully sharp, to avoid harsh aliasing */
}
```
This single change flows through every shadcn component Maia's preset touched. No need to redo
the CLI setup.

## Structural device: hairline rules, not cards/shadows
The reference uses thin `1px` rules — vertical dividers between form fields (the postcard's
Name/Email split), horizontal rules under nav sections — as the primary way to organize space,
instead of bordered cards or drop shadows. Default to this:
```css
.hairline { border-color: var(--color-border); border-width: 1px; }
```
Reserve actual "card" containers (background fill + padding) for the newsletter postcard and
similar deliberately-designed set-piece sections — not for routine UI like product grids.

## Layout principles — still 100% responsive
- **Mobile-first**, same as before — most traffic is Instagram → mobile.
- The split-screen hero (image on one half, product/content on the other) collapses to a
  stacked layout on mobile: full-width image on top, content below, in that order.
- Product grid: 2 columns on mobile, 4 on desktop (`md:grid-cols-3 xl:grid-cols-4`), generous
  gaps (`gap-8` md, `gap-12` desktop) — the reference grid (image 3) has noticeably more
  breathing room between items than a typical e-commerce grid.
- Collage/torn-paper decorative sections (newsletter, brand story) are the one place layout can
  get asymmetric/rotated (`rotate-2`, `-rotate-1` on stacked photo elements) — keep every
  functional page (catalog, product detail, order form) calm and grid-aligned by contrast.
- Test at 375px, 768px, 1440px minimum, same as before.

## Key components

**Nav Bar**
- Three-column layout: left — small-caps text links (`CATALOG / ABOUT US / BLOG`); center —
  monogram wordmark (interlocked initials, e.g. a simple serif "CN" lockup); right — utility
  links (`CART / ACCOUNT / SEARCH`). No background fill, sits directly on the page.

**Hero (Split Screen)**
- Full-bleed photographic half + a light/cream half carrying a small supporting image, the
  product/collection name in large `--font-display` serif, and minimal supporting text.
  Matches image 1 exactly — this is the homepage/collection template.

**Product Card**
- Photo on white/cream background (no card border), name in small-caps `--font-sans`, price
  below in `--font-mono` for that editorial-label feel, optional star rating row (only once you
  have real reviews — ship without it initially rather than faking ratings).
- No hover-scale/glow — a simple, slow opacity dim (0.85) on hover is enough.

**Note Pyramid** (`notes-pyramid.tsx`)
- No pills. Three stacked rows, each a small-caps label (`TOP`, `MIDDLE`, `BASE`) followed by a
  comma-separated list in regular body text, divided by thin hairline rules — reads like a tasting
  note in a print catalog, not a tag cloud.

**Variant Selector**
- Small rectangular buttons (2px radius per the token above), 1px `--border` outline,
  transparent background. Selected state: solid `--ink` fill, white text — this is the *only*
  place solid black fill is used outside the primary CTA, so selection state stays unambiguous.
  Sold-out presets: outline only, muted text, strikethrough price, disabled.
- "Custom Amount" behaves the same as before functionally (reveals an ml input, live price via
  `pricePerMl`) — just restyled: underline-style input (see Order Form below), no expand/spring
  animation, a simple height transition is enough.

**Order Form**
- Underline-style inputs, matching the postcard reference exactly: label to the left (or above
  on mobile), a thin bottom border under the input, no visible box/fill. This is a deliberate,
  distinctive choice — don't default back to filled/bordered input boxes.
- Primary submit button: solid `--ink` fill rectangle, uppercase white `--font-sans` label,
  sharp corners (`--radius` token) — matches the postcard's "SEND" button exactly.
- Still a bottom sheet on mobile / centered panel on desktop for the interaction pattern, just
  styled flat (background-warm fill, hairline top border) instead of glass/blurred.

**"MORE" / Secondary Button**
- Outlined only: 1px `--border`, transparent fill, uppercase label, generous horizontal padding.
  Used for secondary actions (read more, view details) — reserve the solid black fill for the
  one primary action per screen (Order Now / Send).

**Newsletter / Storytelling Sections**
- These are where the collage treatment lives: `--surface-paper` background, a card-like
  postcard panel with a vertical hairline divider between two content halves, a slightly rotated
  stack of photos with white "print" borders (like a photo physically laid on top of paper).
  This visual richness is intentionally concentrated in 1–2 sections (About page, newsletter
  signup) rather than spread across the whole site.

**Footer**
- Plain multi-column link lists (Customer Service / Company Info / Additionally), small
  monogram mark bottom-left, copyright line bottom-right, all in the small-caps `--font-sans`
  style. No decoration.

## Motion — restrained, not absent
Framer Motion is still used, but for quiet effects, not bouncy feedback:
- Scroll-triggered fade-up on section entry (`opacity 0 → 1`, `y: 12 → 0`, ease-out, ~500ms).
- A slow, subtle parallax on hero photography (image moves slower than scroll — a few percent
  offset, not a dramatic effect).
- Hover states: opacity/underline transitions only (`transition-opacity duration-300`), no
  `scale()` press animations, no spring physics. This is the single biggest behavioral
  difference from the retired glass system.

## Accessibility notes
- `--muted` (`#6E6B64`) on `--background-warm` (`#F6F4EF`) is borderline for small text — reserve
  it for captions/labels at a reasonably sized weight, use `--foreground` for anything body-length.
- Underline-style form inputs still need a visible focus state (e.g. thicken the underline to
  2px and switch it to `--ink` on `:focus`) since removing the box border removes an affordance
  sighted keyboard users otherwise rely on.
- Keep shadcn/Base UI's native semantics (`<button>`, `<input>`, `<label>`) — the visual restyle
  changes nothing about the underlying accessible markup.
