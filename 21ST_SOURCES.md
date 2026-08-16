# 21ST_SOURCES.md — provenance of every component named in the V4 brief

Per the brief's non-negotiable rule (section 2), this file records exactly
where each component's code came from, verbatim or not, and what happened
when a source could not be reached.

---

## A. Real, verified sources (4 of 7 named components + the FAQ base)

### 1. Vertical Cut Reveal
- **Brief URL**: https://21st.dev/@danielpetho/components/vertical-cut-reveal
- **21st.dev code tab**: not reachable (loads client-side, not present in
  fetched HTML).
- **Real source found at**: https://github.com/danielpetho/fancy
  (`src/fancy/components/text/vertical-cut-reveal.tsx`), the author's own
  public repository — the same "fancy" library 21st.dev's page links to
  under "Source" (fancycomponents.dev, which mirrors this repo).
- **File imported to**: `src/components/ui/vertical-cut-reveal.tsx`
- **Dependencies**: `framer-motion` (the repo imports from `motion/react`)
- **Kept unmodified**: the entire splitting/staggering/animation algorithm,
  the `forwardRef` + `useImperativeHandle` API, all prop names and defaults.
- **Adaptations**:
  - `import ... from "motion/react"` → `import ... from "framer-motion"`
    (brief mandates framer-motion as the single motion engine, not the
    "motion" package the upstream repo happens to use — same API surface).
  - `transition?: AnimationOptions` → `transition?: Transition` (the type
    name framer-motion exports for this same shape; `AnimationOptions` is
    a `motion/react`-only export).
  - Added a named export `VerticalCutReveal` alongside the original default
    export, since the brief's own usage example imports it by name.
- **Used at**: hero title, `#impronta` title, `€990` in the offer band,
  `richiedi-accesso.html` title.

### 2. SVG Follow Scroll (Skiper 19)
- **Brief URL**: https://21st.dev/@reuno-ui/components/svg-follow-scroll
- **21st.dev code tab**: not reachable directly, but the page's "Source"
  link pointed to https://skiper-ui.com/v1/skiper19.
- **Real source found at**: https://skiper-ui.com/r/skiper19.json — a
  public shadcn-registry JSON endpoint (the same one `pnpm dlx shadcn add
  @skiper-ui/skiper19` fetches), served without authentication.
- **File saved unmodified to**: `src/components/ui/svg-follow-scroll.tsx`
  (kept verbatim, including its own license header, as the brief requires
  saving the original before adapting — this file is excluded from the
  TypeScript build since it's demo-only and not imported by the app).
- **Dependencies**: `framer-motion`
- **Kept from the original in the adapted variant**
  (`src/components/ui/petresona-imprint-path.tsx`): `useScroll`,
  `useTransform`, the `pathLength` animation mapped through
  `strokeDashoffset`, `motion.path`, scroll-synced tracing.
- **Removed per the brief (section 4.D)**: `h-[350vh]`, the
  `translate-y-[200vh]` block, the demo title/footer, the green stroke, the
  unrelated demo SVG path.
- **New**: an original organic trace path (not the demo SVG, not a cartoon
  paw), copper-colored, confined to a 70-90px strip at the right edge of
  `#impronta` (see "Design decisions" below for why it doesn't span all
  three sections the brief lists).
- **Used at**: `#impronta` (right-edge decorative trace).

### 3. Interactive Hover Button
- **Brief URL**: https://21st.dev/@dillionverma/components/interactive-hover-button
- **Real source found at**: https://github.com/magicuidesign/magicui
  (`apps/www/registry/magicui/interactive-hover-button.tsx`) — MagicUI,
  Dillion Verma's own open-source library, which is exactly what the
  21st.dev listing under his handle packages.
- **File imported to**: `src/components/ui/interactive-hover-button.tsx`
- **Dependencies**: `lucide-react`
- **Kept unmodified**: the dot-bloom + label-slide interaction, its
  `group-hover` mechanics, its class structure.
- **Adaptations**: added dual rendering as `<a href>` or `<button>` (the
  original is a bare `<button>`; PetResona's CTAs need to both navigate to
  `richiedi-accesso.html` and submit a form), plus `min-h-[52px]` and
  `active:scale-[0.97]` utility classes per the brief's exact spec — the
  original only sets a plain height via `p-2`.
- **Used at**: hero, `#cosa-ricevi`, offer band, FAQ closing, mobile sticky
  CTA, richiedi-accesso submit button.

### 4. FAQ accordion base
- **Brief URL**: https://21st.dev/@shadcnblockscom/components/accordion-feature-section
  (brief explicitly says not to copy the whole feature section, only the
  real accordion primitive/behavior as a base)
- **Real source found at**: https://github.com/shadcn-ui/ui
  (`apps/v4/registry/new-york-v4/ui/accordion.tsx`) — the canonical shadcn
  Accordion, built on Radix UI (`radix-ui` package).
- **File imported to**: `src/components/ui/accordion.tsx`, byte-identical
  to upstream.
- **Dependencies**: `radix-ui`, `lucide-react`
- **Adaptations**: none to the primitive itself. PetResona styling (copper
  active border, chevron rotation, spacing) is applied entirely via
  `className` props at the call site in `src/components/sections/FaqSection.tsx`.
- **Used at**: `#faq`.

---

## B. Real sources supplied directly by the client (2026-08-16 correction)

The unauthenticated `curl` 403s recorded below (kept for the audit trail)
were exactly that — an unauthenticated-route limitation, not proof the
components didn't exist. The client retrieved all four real `Component.tsx`
files from the authenticated 21st.dev `Source > Component.tsx` tab and
supplied them directly (`PETRESONA_21ST_REAL_SOURCES_FOR_CLAUDE.zip`). The
four originally-flagged implementations below have been **replaced**,
starting from those real files, per the correction instructions
(`ISTRUZIONI_CLAUDE_SOSTITUZIONE_4_COMPONENTI_21ST.md`). Each file's header
comment states the source URL and the specific adaptations made; the
previous "not the real source" implementations are kept only as
`.provisional-backup/*.tsx` inside the project for reference/diff, not
shipped in the build.

### 5. Reveal Image Mask — now real source, adapted
- **Brief URL**: https://21st.dev/@daiwiikharihar/components/reveal-image-mask
- **Earlier unauthenticated check**: `curl https://21st.dev/r/daiwiikharihar/reveal-image-mask.json`
  → `HTTP 403 {"error":"Authentication required", ...}` (authenticated-route
  limitation, not a missing component — see section A above).
- **File**: `src/components/ui/reveal-image-mask.tsx`
- **Dependencies**: `framer-motion`, `@/lib/utils` (`cn`)
- **Kept from the real source**: `useScroll` (targeting the component's own
  element, `offset: ["start 85%", ...]`), `useSpring` (stiffness 170 /
  damping 24 / mass 0.95), `useTransform` building the `clipPath` string,
  `useReducedMotion` short-circuit, `useWillChange`, the `motion.img` with
  `style={{ clipPath, willChange }}`, `React.forwardRef` ref-merging pattern.
- **Demo parts removed**: the outer padded "card" `<div>` wrapper, the
  eyebrow/title/caption block (`"Reveal image mask"` / `title` / `caption`
  props), the Unsplash default `src`/`alt`, the `shape: "circle" | "rounded"`
  switch (brief wants one organic mask, not a perfect circle).
  Content-visible parts of the demo are entirely gone — the exported
  component now renders only the masked `<img>`.
- **Adapted**: the two `shape` clip-path targets were replaced by a single
  organic 8-point polygon (`ORGANIC_CLOSED`) opening to a full rounded frame
  (`ORGANIC_OPEN`), still driven by the same spring-smoothed `progress`
  value from the original scroll pipeline. `offset` narrowed to
  `["start 85%", "start 35%"]` (from the original's `["start 85%", "end
  15%"]`) so the mask fully resolves shortly after the photo enters view
  rather than tracking the whole way through the section, closer to the
  brief's "opens once" framing while keeping the real scroll-linked
  mechanism intact.
- **Used at**: `#giorgia` (`GiorgiaSection.tsx`, prop contract unchanged:
  `src`, `alt`, `className`, `imgClassName`).
- **Tested**: build passes; visual check at 1440×900 confirms the photo
  fully opens (organic → rectangular) as the section scrolls into view;
  `prefers-reduced-motion` short-circuits to the static, fully-open image.

### 6. Scroll Reveal Image — now real source, adapted
- **Brief URL**: https://21st.dev/@unlumen/components/scroll-reveal-image
- **Earlier unauthenticated check**: `curl https://21st.dev/r/unlumen/scroll-reveal-image.json`
  → `HTTP 403 {"error":"Authentication required", ...}`.
- **File**: `src/components/ui/scroll-reveal-image.tsx`
- **Dependencies**: `framer-motion` (`next/image` in the original — removed,
  see below).
- **Kept from the real source, unchanged**: `useScroll` (`target:
  containerRef`, configurable `offset`), `useTransform` (width/scale/radius
  from the same `scrollYProgress`), `useSpring` smoothing all three, the two
  nested `motion.div` containers (outer sizes/clips, inner overflows wider
  and scales for the zoom), the full prop contract and defaults.
- **Only change**: `import Image from "next/image"` → a plain `<img>`. The
  original's `fill` prop (`position:absolute; inset:0; width:100%;
  height:100%; object-fit:cover`) is replicated via inline style since Vite
  has no equivalent. `priority` maps to `fetchPriority="high"` +
  `loading="eager"`; `quality` has no native equivalent and was dropped
  (documented in the component's own header comment). A named export was
  added alongside the original's default export so the rest of the
  codebase's `import { ScrollRevealImage }` didn't need to change.
- **Called with the brief's exact required config** (`HeroSection.tsx`):
  `fromWidth="68%" toWidth="100%" fromScale={1.12} toScale={1}
  fromRadius="48px" toRadius="12px" stiffness={115} damping={38}
  height="100%"`. No demo `50vh` spacers anywhere; the reveal is driven by
  the hero's own height, adding no page height, and is already resolving
  within the first viewport since the hero image sits at the top of the
  page.
- **Used at**: hero (`HeroSection.tsx`), non-reduced-motion branch only —
  a static full-bleed `<img>` renders under `prefers-reduced-motion`.
- **Tested**: build passes (`next/image` fully gone from the Vite build —
  confirmed via `grep -r "next/image" src` returning nothing); visual check
  at 1440×900 and 390×844 shows the hero photo already at full width/scale
  in the first viewport with no layout shift.

### 7. Spatial Product Showcase — now real source, adapted
- **Brief URL**: https://21st.dev/@daiwiikharihar/components/spatial-product-showcase
- **Earlier unauthenticated check**: `curl https://21st.dev/r/daiwiikharihar/spatial-product-showcase.json`
  → `HTTP 403 {"error":"Authentication required", ...}`.
- **File**: `src/components/ui/spatial-product-showcase.tsx`
- **Dependencies**: `framer-motion` (`lucide-react` in the original, dropped
  — the icon-driven feature bars it powered were removed, see below).
- **Kept from the real source**: `AnimatePresence` wrapping the swapping
  content keyed by the active item; the `container`/`item` stagger variant
  pair (`staggerChildren`/`delayChildren`, spring-in opacity/y/blur, exit
  fade); `layoutId` on the active-indicator pill inside the trigger dock, so
  the highlight morphs between triggers instead of jump-cutting;
  `whileTap={{ scale: 0.96 }}` on the trigger buttons; a user-driven active
  selector; directional content change between data states.
- **Demo parts removed** (all confirmed absent from the shipped file):
  the two-earbud dataset and images; `Battery`/`Bluetooth`/`Wifi`/`Music`
  icons and the battery-percentage / feature-bar readouts; "View Specs";
  the black/blue/emerald tech-gradient background and glow layer; the
  infinite `rotate: 360` ring and the infinite `scale`/`y` breathing loops;
  the image variant's ±30° initial rotation, `scale:1.5` and 15px blur
  entrance; the `fixed bottom-12` switcher and `fixed inset-0` background;
  `min-h-screen` on the root.
- **Adapted**: two earbuds → three PetResona items (`traccia` → Traccia
  d'Ambiente, `codice` → Codice Impronta, `guida` → Guida Impronta), reusing
  the V3 copy and CSS/SVG mockups as each item's `visual`. The trigger dock
  moved from a fixed floating pill to inline placement under the stage,
  restyled in the ivory/copper/brown palette. A compact single-open mobile
  layout was added — the real component has no mobile treatment of its own
  — per the brief's explicit "adapt responsive behavior" instruction; this
  keeps the desktop stage's real mechanism untouched while avoiding the
  accordion+mockup duplication the brief calls out.
- **Used at**: `#cosa-ricevi` (`CosaRiceviSection.tsx`, same `items` prop
  contract as before: `{index, label, description, visual}[]`).
- **Tested**: build passes; clicked through all three triggers at 1440×900
  — the active pill morphs via `layoutId`, the stage text/visual swap with
  the coordinated variants, no autoplay, single item active at a time;
  mobile (390×844) shows three compact accordion-style triggers, one open.

### 8. Liquid Morph Floating Menu — now real source, adapted
- **Brief URL**: https://21st.dev/@aayush-duhan/components/liquid-morph-floating-menu
- **Earlier unauthenticated check**: `curl https://21st.dev/r/aayush-duhan/liquid-morph-floating-menu.json`
  → `HTTP 403 {"error":"Authentication required", ...}`.
- **File**: `src/components/ui/liquid-morph-floating-menu.tsx`
- **Dependencies**: `framer-motion`
- **Kept from the real source**: the exact `ease = [0.22, 1, 0.36, 1]`
  constant; the width/height/borderRadius morph animation on the
  container; the "a color layer expands from within to reveal the open
  state" mechanism (the original's dark circle growing from the bottom —
  reused as a clip-path circle expanding from the trigger for PetResona's
  mobile panel); `MenuButton`'s per-character split-flap "roll" (two
  stacked copies of each character, `translateY(-50%)` on hover, staggered
  `30ms * index`) — reused near-verbatim as `<LetterRoll>`; the item
  stagger delay formula `0.4 + 0.08 * index` with opacity-only entrance;
  close-on-outside-click via a `mousedown` document listener.
- **Demo parts removed**: `fixed bottom-10 left-1/2` floating-pill
  positioning (integrated into `<header>` instead); "Home / Works /
  Contact" placeholder items; the `#FFE862` yellow / `#242424` dark demo
  palette.
- **Adapted**: the original is a single floating button that expands into a
  vertical menu — PetResona's header instead needs *always-visible* desktop
  links plus a *separate* mobile toggle, so the morph mechanism was split in
  two: (a) the header capsule itself (transparent bar → ivory pill after
  40px scroll, using the same `layout`+`ease` morph) and (b) the mobile
  panel (closed hamburger → open sheet, using the circle-expand reveal and
  the `LetterRoll`-derived stagger). Real section anchors replace the demo
  items. Added, none of which exist in the original: `aria-expanded`,
  `aria-controls`, `aria-label`, Escape-to-close with focus return to the
  trigger button, scroll lock only while the mobile panel is open, and
  disabling the letter-roll both on touch (`matchMedia("(hover: none)")`)
  and under `prefers-reduced-motion` (the original has neither guard).
- **Used at**: site header (`SiteHeader.tsx`), rendered on both pages.
- **Tested**: build passes; keyboard test confirms `Escape` closes the
  mobile panel and returns focus to the hamburger button
  (`aria-expanded` flips `true` → `false`); outside-click closes it;
  desktop hover on a nav link triggers the letter-roll at 1440×900; at
  390×844 the roll is confirmed absent (touch media query); menu never
  floats center/bottom — it's anchored in the fixed header at all times.

---

## C. Design decisions worth flagging explicitly

- **Imprint trace scope**: the brief asks the trace to cross "the tail end
  of the hero, `#impronta`, and the entry of `#cosa-ricevi`." It was scoped
  to `#impronta` only, confined to a 70-90px strip at the right edge of the
  section (not full-width), specifically to satisfy the brief's stronger,
  non-negotiable constraint — "non deve attraversare testi, CTA o volti" —
  by construction, rather than by careful pixel-matching against a hero
  and showcase whose layouts weren't yet built when the trace was wired up.
  Extending it precisely across all three sections without risking an
  overlap would need a follow-up pass with the real rendered layout open
  side-by-side. Not verified beyond a single 1440×900 screenshot review.
- **Header capsule contrast**: since the mobile nav panel is always a
  light "paper" surface, the header is forced into its dark-on-light
  variant whenever the panel is open — even before 40px of scroll — to
  avoid an invisible-hamburger repeat of a real bug found in an earlier
  PetResona iteration (light-on-light contrast over an ivory panel).
