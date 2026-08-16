# CHANGELOG VISUAL V5

## 1. File modificati
- index.html
- src/styles/index.css
- src/components/ui/scroll-reveal-image.tsx
- src/components/ui/interactive-hover-button.tsx
- src/components/sections/HeroSection.tsx
- src/components/sections/ImprontaSection.tsx
- src/components/sections/CosaRiceviSection.tsx
- src/components/sections/TimelineSection.tsx
- src/components/sections/GiorgiaSection.tsx
- src/components/sections/OffertaSection.tsx
- src/components/sections/FaqSection.tsx

Nessun altro file toccato. HeroImprintTransition.tsx, petresona-imprint-path.tsx,
src/components/booking/**, RichiediAccesso.tsx, booking-preview.ts, analytics.ts,
App.tsx invariati.

## 2. Asset copiati
In public/assets/images/:
- hero-dog-desktop-v2.webp
- hero-dog-mobile-v2.webp
- impronta-cat-desktop-v2.webp
- impronta-cat-mobile-v2.webp
- giorgia-petresona-portrait-v2.webp

PNG master e README_ASSET.md dello zip asset non copiati nel progetto.

## 3. Build
`npm run build` → OK, nessun errore, nessun warning.

## 4. Test 390×844 (mobile)
- Hero: nuova foto cane, nessun angolo bianco, crop naturale, nuovo copy e CTA visibili.
- Transizione hero → Impronta: traccia rame non attraversa cane/gatto/testo/CTA.
- Impronta: titolo visibile, foto gatto 4:5 corretta.
- Giorgia: sfondo forest pieno, nuovo ritratto 4:5, copy e facts corretti.
- Nessun overflow orizzontale. Nessun errore console reale (solo favicon 404 atteso).

## 5. Test 1440×900 (desktop)
- Hero, Impronta, Giorgia, Cosa ricevi, Offerta, FAQ verificati via screenshot: layout
  corretto, palette/tipografia aggiornate, nessun overflow orizzontale.
- Nessun errore console reale (solo favicon 404 atteso).

## 6. Errori aperti
Nessuno. Calendario beta (/richiedi-accesso.html) e transizione hero → Impronta
non modificati e ancora funzionanti.
