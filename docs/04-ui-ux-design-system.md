# UI/UX Design System

## Direction
Apple's "liquid glass" language (as seen across recent iOS/visionOS/macOS UI): translucent,
frosted surfaces that feel like they're made of glass — light refracts through them, they have
a soft specular highlight, and they respond to touch with a subtle spring/bounce rather than a
flat state change. Applied here in a **strict monochrome palette** — white, black, and greys
only. No gold, no color accents. The glass effect itself carries all the visual richness, so
the palette can stay quiet.

This pairs well with your existing IG aesthetic (dark, minimal, moody product photography) —
think of the UI chrome (buttons, nav, sheets, cards) as glass floating over that dark
photography, rather than competing with it.

## Config note (Tailwind v4)
Next.js 16 scaffolds Tailwind v4, which is CSS-first — there's no `tailwind.config.ts` to edit.
Declare every token below directly in `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-background: #000000;
  --color-surface: #0D0D0D;
  --color-foreground: #FAFAFA;
  --color-muted: #8A8A8E;
  /* glass tokens are plain CSS variables, not Tailwind theme colors, since they use rgba() */
}

:root {
  --glass-fill: rgba(255, 255, 255, 0.10);
  --glass-fill-hover: rgba(255, 255, 255, 0.16);
  --glass-fill-pressed: rgba(255, 255, 255, 0.22);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-highlight: rgba(255, 255, 255, 0.35);
  --glass-blur: 20px;
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```
`@theme` tokens become usable as Tailwind utilities (e.g. `bg-background`, `text-muted`); the
glass variables stay as plain CSS custom properties referenced from the `.glass` class shown
below, since `rgba()` values with variable opacity don't map cleanly to Tailwind's color utilities.

## Color palette (monochrome, dark-first)

| Token | Value | Use |
|---|---|---|
| `--background` | `#000000` | Page background |
| `--surface` | `#0D0D0D` | Base layer under glass panels |
| `--foreground` | `#FAFAFA` | Primary text |
| `--muted` | `#8A8A8E` | Secondary text, captions |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Hairline dividers |
| `--danger` | `#D4D4D8` on `rgba(255,255,255,0.06)` | Sold out / errors — communicated via icon + text weight, not red, to stay monochrome |

### Glass surface tokens
```css
--glass-fill: rgba(255, 255, 255, 0.10);
--glass-fill-hover: rgba(255, 255, 255, 0.16);
--glass-fill-pressed: rgba(255, 255, 255, 0.22);
--glass-border: rgba(255, 255, 255, 0.18);
--glass-highlight: rgba(255, 255, 255, 0.35);   /* top-edge specular line */
--glass-blur: 20px;
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
```

For light-background contexts (e.g. a photo-heavy hero), invert to dark glass:
```css
--glass-fill-on-light: rgba(0, 0, 0, 0.08);
--glass-border-on-light: rgba(0, 0, 0, 0.12);
```

## The liquid glass effect, concretely

A glass CTA/button/card is built from layered CSS, not an image:

```css
.glass {
  background: var(--glass-fill);
  backdrop-filter: blur(var(--glass-blur)) saturate(160%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(160%);
  border: 1px solid var(--glass-border);
  border-radius: 20px; /* generous, continuous-curve radius — avoid sharp corners entirely */
  box-shadow:
    var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight); /* the specular top edge that sells "glass" */
  transition: background 0.2s ease, transform 0.15s ease;
}

.glass:hover {
  background: var(--glass-fill-hover);
}

.glass:active {
  background: var(--glass-fill-pressed);
  transform: scale(0.97); /* the "liquid" press — pairs with a spring animation, see below */
}
```

**Motion (Framer Motion):** every glass element that's tappable should animate press/release
with a spring, not a linear transition:
```tsx
<motion.button
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
  className="glass ..."
>
  Order Now
</motion.button>
```
This spring-back is what makes it read as "liquid" rather than flat/static. Apply it to: the
primary CTA, variant selector pills, nav items, and the bottom-sheet's drag handle.

**Backdrop-blur performance note:** `backdrop-filter` is GPU-intensive on long scrolling lists.
Use it on fixed/sticky/floating elements (nav bar, CTAs, sheets, cards with a handful on
screen) — for a catalog grid of 30+ product cards, use a flat semi-transparent background
instead of full backdrop-blur per card, or blur only the visible viewport's cards.

## Component library approach
Use **shadcn/ui** (Radix primitives + Tailwind) as the accessible, headless foundation —
it gives you real keyboard navigation, focus states, and ARIA behavior for free. Then override
every component's default styling with the `.glass` treatment above. This is the "any
component library is fine as long as it's consistent" answer: shadcn because it doesn't ship
opinionated visuals to fight against, but the actual look comes entirely from your own glass
utility classes layered on top.

Build a small internal set on top of it:
- `<GlassButton />` — primary CTA style
- `<GlassCard />` — product cards, info panels
- `<GlassSheet />` — the order form bottom sheet
- `<GlassPill />` — variant selector, filter chips

Every other component in the app should compose from these four, not invent new surface
treatments — this is what keeps the UI "consistent" across the whole site.

## Typography
- **Headings:** SF Pro–adjacent — use `Inter` (very close metrics, free, works well at glass-UI
  scale) or `Geist` (Vercel's font, also a strong fit and pairs naturally with a Next.js/Vercel
  stack). Avoid serif here — liquid glass is a distinctly modern, not boutique-vintage, look.
- **Body/UI text:** same family as headings, different weights — one consistent type family
  keeps the monochrome system feeling deliberate rather than empty.
- Tight, confident tracking on labels ("MEN" / "WOMEN" / "UNISEX" / "DECANT" / "FULL BOTTLE")
  — small caps, letter-spacing 0.05em.

## Layout principles — 100% responsive by default
- **Mobile-first**, always design/build the 375–430px layout first, then scale up with
  Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
- Use fluid type/spacing (`clamp()`) for hero headings and section padding instead of fixed
  per-breakpoint values, so it doesn't visibly "jump" between breakpoints.
- Product grid: 2 columns on mobile, 3 on tablet (`md`), 4 on desktop (`xl`). Consistent gap
  (`gap-4` mobile → `gap-6` desktop).
- Product photo aspect ratio: fixed (e.g. 4:5) across every card via `aspect-[4/5]` +
  `object-cover`, so the grid stays uniform regardless of source photo dimensions.
- The order form is a **bottom sheet on mobile** (slides up, draggable via Framer Motion's
  `drag="y"`), and a **centered modal on desktop** (`md:` breakpoint swaps the presentation,
  not the component logic).
- Test every screen at minimum: 375px (small phone), 768px (tablet), 1440px (desktop). Don't
  rely on browser dev-tool presets alone — check on an actual phone before launch.

## Key components

**Product Card**
- Photo, brand (small, muted), name (heading font), price range (e.g. "৳450 – ৳8,500"),
  gender tag as a small glass pill in the corner, "Sold Out" glass overlay if no preset
  variant has stock (custom amounts still orderable unless the product itself is inactive).

**Note Pyramid** (`notes-pyramid.tsx`)
- Three stacked rows — Top / Middle / Base — each a horizontal list of small glass pills.
  This is a recognizable, expected pattern in fragrance retail; don't reinvent it, just glass-ify it.

**Variant Selector**
- Preset pills in a row: 5ml / 10ml / 15ml / Full Bottle — glass pills, `.glass` styling,
  disabled + reduced opacity + "Sold Out" label when `stockQty === 0`.
- A distinct "Custom Amount" pill that, when tapped, expands (spring animation) into a number
  input + live-updating price, using `pricePerMl` from `lib/pricing.ts`.

**Order Form (Glass Sheet)**
- One screen, 5 fields max, running total shown near the glass "Confirm Order" CTA.
- Bottom-sheet on mobile, modal on desktop — see layout principles above.

**Confirmation Page**
- A glass card with the order number, and warm, human-toned copy reinforcing that a real
  person is about to reach out. This is a trust touchpoint — matches the understated,
  confident tone of your IG bio, not generic e-commerce "Thank you for your purchase!" copy.

## Accessibility notes
- Glass surfaces rely on blur + subtle contrast — always pair with a `--glass-border` outline
  so elements remain legible/distinguishable even where `backdrop-filter` isn't supported
  (older browsers fall back to the solid `--glass-fill` color, which must still pass contrast
  on its own).
- Body text sits on solid `--background`/`--surface`, not directly on blurred glass, to
  guarantee contrast regardless of what's behind the blur.
- Keep shadcn/ui's native `<button>`, `<input>`, and `<label>` semantics — don't replace them
  with styled `<div>`s, or you lose keyboard/screen-reader support the glass restyle depends on.
