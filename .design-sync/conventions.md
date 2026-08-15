# PetResona — component conventions

## Setup

No provider wrapper is required — components read design tokens directly from CSS custom properties on `:root` (already bound in `styles.css`). Just render the component; no context/theme wrapper needed.

## Typography

Two font families, both loaded via `@font-face` in the bound stylesheet:

- **Display / headings**: `Newsreader` (serif) — use for `<h1>`–`<h3>`, section titles, and any moment that should read as editorial/premium.
- **Body / UI**: `Manrope` (sans) — the default; used for paragraphs, buttons, labels, form fields.

Apply via Tailwind's `font-serif` (→ Newsreader) and the default body font (→ Manrope, already the base `font-sans`). Don't introduce a third family.

## Color tokens (CSS custom properties)

Use these `var(--*)` tokens — never hardcode hex. The palette is warm ivory / deep plum / copper, not a generic light-mode grayscale:

| Token | Role | Value |
|---|---|---|
| `--background` | page background | `#F6F0E7` (warm ivory) |
| `--foreground` | body text | `#282428` |
| `--primary` | brand accent, CTAs, dark surfaces | `#4A2235` (deep plum) |
| `--primary-foreground` | text on `--primary` | `#FFFDF9` |
| `--secondary` / `--muted` | subtle section backgrounds | `#ECE1D0` |
| `--accent` | sand surface | `#D8C5AA` |
| `--color-accent-copper` | decorative accent (glows, dots) | `#B67A4A` |
| `--color-accent-copper-text` | copper used AS TEXT (accessible contrast) | `#955A32` — always use this, not `--color-accent-copper`, for copper-colored text |
| `--border` | hairlines | `rgba(40,36,40,.14)` |
| `--card` | raised surface | `#FFFDF9` |

Apply via Tailwind utilities bound to these tokens (`bg-primary`, `text-primary-foreground`, `bg-secondary`, `border-border`, etc.) or `bg-[color:var(--color-accent-copper-text)]` for the two copper tokens, which aren't in the default Tailwind palette.

## Shape language

Large content surfaces (pricing card, image-mask frame) use a generous, uniform radius well past Tailwind's default scale — `rounded-[2rem]` to `rounded-[2.5rem]`, not `rounded-lg`/`rounded-xl`. Small UI elements (buttons, badges, form inputs) use normal scale rounding (`rounded-md`/`rounded-full`). When composing a new large card or frame in this system, reach for `rounded-[2rem]` or larger, never the default Tailwind radius scale.

## Motion

Framer Motion (`motion/react` / `framer-motion`) is the only animation library — several components (`ScrollExpandMedia`, `RevealImageMask`, `TextRevealByWord`, `HowItWorks`) already use `useScroll`/`useTransform`/`whileInView` for scroll-linked reveals. Match that idiom for new motion — scroll-bound reveals should be reversible (driven by scroll position, not a timer), and one-shot reveals should use `viewport={{ once: true }}`. Respect `prefers-reduced-motion` (`useReducedMotion()`) — several shipped components branch to a static render when it's set; do the same for new compositions.

## Where the truth lives

Read `styles.css` (root) for the full token list and `_ds_bundle.css` for component-level styles — both are in the bound stylesheet closure. Per-component `.prompt.md` files carry usage notes extracted from source; `RevealImageMask`, `ScrollExpandMedia`, and `TextRevealByWord` in particular have real prop-level docs worth reading before composing with them (they take real image/text content, not just children).

## Example — pricing-style card in this idiom

```tsx
<div className="rounded-[2rem] bg-primary p-8 text-primary-foreground">
  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
    Eyebrow label
  </p>
  <h3 className="mt-2 font-serif text-2xl font-semibold">Card title</h3>
  <p className="mt-4 text-primary-foreground/80">Supporting copy in Manrope.</p>
  <button className="mt-6 rounded-full bg-[color:var(--color-accent-copper)] px-6 py-3 text-sm font-semibold text-primary">
    Call to action
  </button>
</div>
```
