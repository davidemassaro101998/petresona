# QA Report V4 CORRECTED — PetResona Impronta, motion/premium rebuild

This report supersedes `QA_REPORT_V4.md`. It documents the correction pass
that replaced the four flagged "original implementation" components with
the real 21st.dev sources the client supplied
(`PETRESONA_21ST_REAL_SOURCES_FOR_CLAUDE.zip`), per
`ISTRUZIONI_CLAUDE_SOSTITUZIONE_4_COMPONENTI_21ST.md`. See `21ST_SOURCES.md`
for the full per-component provenance — summarized here.

## 1. I quattro componenti provvisori sono stati sostituiti

All'inizio di questa correzione, `.provisional-backup/` è stata popolata
con una copia dei quattro file "implementazione originale dichiarata" prima
di toccarli (conservati per confronto, non nel build). Tutti e sette i
componenti nominati dal brief V4 sono ora basati su sorgente reale:

| Componente | Fonte reale | File | Stato |
| --- | --- | --- | --- |
| Vertical Cut Reveal | github.com/danielpetho/fancy | `vertical-cut-reveal.tsx` | invariato da questa correzione |
| SVG Follow Scroll (Skiper 19) | skiper-ui.com/r/skiper19.json | `svg-follow-scroll.tsx` + `petresona-imprint-path.tsx` | invariato da questa correzione |
| Interactive Hover Button | github.com/magicuidesign/magicui | `interactive-hover-button.tsx` | invariato da questa correzione |
| Accordion (base FAQ) | github.com/shadcn-ui/ui | `accordion.tsx` | invariato da questa correzione |
| **Reveal Image Mask** | 21st.dev, Source > Component.tsx (fornito dal cliente) | `reveal-image-mask.tsx` | **sostituito in questa correzione** |
| **Scroll Reveal Image** | 21st.dev, Source > Component.tsx (fornito dal cliente) | `scroll-reveal-image.tsx` | **sostituito in questa correzione** |
| **Spatial Product Showcase** | 21st.dev, Source > Component.tsx (fornito dal cliente) | `spatial-product-showcase.tsx` | **sostituito in questa correzione** |
| **Liquid Morph Floating Menu** | 21st.dev, Source > Component.tsx (fornito dal cliente) | `liquid-morph-floating-menu.tsx` | **sostituito in questa correzione** |

I quattro file reali ricevuti sono conservati anche in
`.21st-real-sources-received/` (non nel build) come riferimento/prova.

## 2. Quali parti dei sorgenti reali sono state mantenute

Sintesi (dettaglio riga-per-riga in `21ST_SOURCES.md`, sezione B):

- **Reveal Image Mask**: `useScroll`/`useSpring`/`useTransform` sul
  `clipPath`, `useReducedMotion`, `useWillChange`, il `motion.img` con
  ref-merging via `forwardRef` — tutto mantenuto. Adattato: le due varianti
  `shape` sostituite da un'unica maschera organica; `offset` ristretto per
  aprirsi subito ed esaurirsi mentre la sezione entra in vista.
- **Scroll Reveal Image**: l'intera pipeline `useScroll` → `useTransform`
  (width/scale/radius) → `useSpring`, i due contenitori `motion.div`
  annidati — mantenuti integralmente. Unica modifica: `next/image` → `<img>`
  nativo (Vite non ha equivalente Next).
- **Spatial Product Showcase**: `AnimatePresence`, le varianti
  `container`/`item` con stagger, il `layoutId` dell'indicatore attivo,
  `whileTap` sui trigger, il selettore comandato dall'utente, il cambio
  direzionale dei contenuti — tutto mantenuto. Dati riconvertiti da due
  auricolari a tre elementi PetResona.
- **Liquid Morph Floating Menu**: la curva `ease=[0.22,1,0.36,1]`, il morph
  width/height/borderRadius, il meccanismo "cerchio che espande il colore
  per rivelare lo stato aperto", il roll lettera-per-lettera di
  `MenuButton` (riusato come `<LetterRoll>`), la formula di stagger
  `0.4 + 0.08*index`, la chiusura al click esterno — tutto mantenuto.
  Il componente originale è un singolo pulsante flottante che si espande in
  un menu verticale; per l'header di PetResona il meccanismo di morph è
  stato applicato sia alla capsula header (trasparente → avorio dopo 40px)
  sia al pannello mobile (hamburger chiuso → foglio aperto).

## 3. Quali parti demo sono state eliminate

- **Reveal Image Mask**: card imbottita esterna, blocco eyebrow/titolo/
  caption, `src`/`alt` di default Unsplash, lo switch `circle`/`rounded`.
- **Scroll Reveal Image**: nessuno spacer `50vh`; nessuna immagine multipla;
  `next/image`.
- **Spatial Product Showcase**: auricolari e relative immagini esterne;
  icone `Battery`/`Bluetooth`/`Wifi`/`Music` e le relative percentuali/barre;
  "View Specs"; sfondo tech nero/blu/verde neon con glow; anello `rotate:
  360` infinito; loop `scale`/`y` infiniti; rotazione iniziale ±30° e blur
  15px dell'immagine; switcher `fixed bottom-12`; sfondo `fixed inset-0`;
  `min-h-screen` obbligatorio sulla radice.
- **Liquid Morph Floating Menu**: posizionamento `fixed bottom-10
  left-1/2`; voci placeholder "Home/Works/Contact"; palette demo
  `#FFE862`/`#242424`.

Confermato via `grep`: nessun testo demo, nessuna immagine esterna demo,
nessuna icona `lucide-react` residua dallo showcase (Battery/Bluetooth/
Wifi/Music/Sliders/ChevronRight rimosse insieme alla UI che le usava),
`next/image` assente dal codice sorgente attivo.

## 4. Risultato build

```
npm run build
> tsc -b && vite build
✓ built in 2.34s
```

Build TypeScript e Vite completate senza errori né warning, dopo
l'integrazione dei quattro sorgenti reali. Output invariato nella forma:
`dist/index.html`, `dist/richiedi-accesso.html`, asset con hash in
`dist/assets/`, font e immagini da `public/assets/` senza duplicazione
base64.

## 5. Dimensioni responsive testate

Rieseguito con Playwright/Chromium dopo l'integrazione:

| Viewport | Overflow orizzontale | Errori console |
| --- | --- | --- |
| 390×844 | Nessuno | Nessuno (solo probe automatico `/favicon.ico`, non un errore dell'app) |
| 430×932 | Nessuno | Nessuno |
| 768×1024 | Nessuno | Nessuno |
| 1440×900 | Nessuno | Nessuno |

Verificato inoltre, sui quattro componenti appena sostituiti:
- **Hero (Scroll Reveal Image reale)**: foto già a larghezza/scala piena nel
  primo viewport a 1440×900 e 390×844, nessun layout shift, nessuno scroll
  aggiuntivo creato dal componente.
- **Giorgia (Reveal Image Mask reale)**: maschera organica confermata via
  screenshot (non un cerchio), foto pienamente rivelata mentre la sezione
  entra in vista, nessuna altezza extra.
- **Cosa ricevi (Spatial Product Showcase reale)**: click su tutti e tre i
  trigger a 1440×900 — la pillola attiva morfa via `layoutId`, testo e
  visual si scambiano con le varianti coordinate, nessun autoplay; a
  390×844 tre trigger compatti, uno aperto alla volta, nessuna
  duplicazione accordion+mockup.
- **Header/menu (Liquid Morph Floating Menu reale)**: capsula avorio dopo
  40px di scroll confermata; a 390×844 apertura/chiusura del pannello
  mobile confermata via `aria-expanded` (`false → true → false`), `Escape`
  chiude e riporta il focus sul pulsante hamburger, click esterno chiude,
  roll lettera-per-lettera confermato attivo su hover desktop (1440×900) e
  assente su viewport touch (390×844).
- **Reduced motion**: `h1` a `opacity:1` immediato, nessun errore durante lo
  scroll.
- **Tastiera**: FAQ accordion apribile con `Tab` + `Enter`; menu mobile
  chiudibile con `Escape`.
- **Modulo**: invio vuoto → 7 campi segnalati; invio con dati validi →
  messaggio esplicito "nessuna richiesta è stata inviata" (nessun falso
  successo) — comportamento invariato, la pagina del modulo non usa nessuno
  dei quattro componenti sostituiti.

## 6. Altezza totale pagina (a 390×844)

```
V3:              scrollHeight 7370px → rapporto 8.73
V4 (originale):  scrollHeight 7639px → rapporto 9.05
V4 (corretto):   scrollHeight 7619px → rapporto 9.03
```

Sostanzialmente invariata rispetto alla V4 originale (-0.02, entro il
rumore di misura) e sempre **ben sotto** il limite del +10% rispetto alla
V3 imposto dal brief e sotto la soglia di 10–10.5 schermate.

## 7. Errori console

Nessuno introdotto dalla correzione. L'unica voce non-200 osservata resta
la richiesta automatica del browser per `/favicon.ico` (nessun favicon
reale è stato ancora fornito — invariato dalla V4 originale).

## 8. Accessibilità e reduced motion

- Skip link, focus visibile, `aria-expanded`/`aria-controls` su hamburger e
  FAQ — invariati.
- **Aggiunto in questa correzione** (assente nel sorgente reale del menu):
  `aria-label` dinamico sul pulsante hamburger, chiusura con `Escape` e
  ritorno del focus al trigger, blocco scroll solo a pannello mobile
  aperto, disattivazione del roll lettera-per-lettera su touch
  (`matchMedia("(hover: none)")`) e sotto `prefers-reduced-motion`.
- `prefers-reduced-motion`: verificato su tutti e quattro i componenti
  sostituiti — Reveal Image Mask e Scroll Reveal Image mostrano
  immediatamente lo stato finale statico; Spatial Product Showcase salta le
  varianti animate (le stesse `undefined` già usate per gli altri
  componenti del progetto); Liquid Morph Floating Menu porta la
  `transition` del pannello mobile a `duration:0`.
- Lighthouse non eseguito in questo ambiente (invariato dalla V4
  originale) — non dichiarato come verificato.

## 9. Elementi ancora aperti / blocchi reali

Invariati rispetto alla V4 originale (nessuno di questi riguarda i quattro
componenti appena corretti):

1. **Backend del modulo non collegato** — nessun endpoint reale fornito;
   comportamento corretto (nessun falso successo) mantenuto.
2. **Link legali reali mancanti** (privacy, cookie, termini) — placeholder
   espliciti nel codice, nessun URL inventato.
3. **Dati aziendali reali mancanti** (ragione sociale, indirizzo, P.IVA,
   email, canonical, favicon, Open Graph) — segnalati con commenti TODO.
4. **Posizionamento esatto della traccia Impronta attraverso tre sezioni**
   (hero → `#impronta` → ingresso `#cosa-ricevi`): resta implementata solo
   su `#impronta` (vedi `21ST_SOURCES.md`, sezione C) — non toccata da
   questa correzione, che riguardava esclusivamente i quattro componenti
   elencati nell'istruzione correttiva.
5. **Audit Lighthouse formale**: non eseguito in questo ambiente.

## 10. Conferma dipendenze

Stack invariato: React, TypeScript, Vite, Tailwind CSS v4, struttura shadcn
(`src/components/ui`), `framer-motion` come unico motore di animazione,
`lucide-react` solo dove richiesto (icone accordion e freccia del bottone —
le icone dello showcase demo, Battery/Bluetooth/Wifi/Music/Sliders/
ChevronRight, sono state rimosse insieme alla UI che le usava). Nessun
GSAP, Lenis o Anime.js. Font e immagini restano file esterni in
`public/assets/`, non duplicati in base64.
