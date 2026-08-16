# QA Report V4 FINAL — Calendario beta + transizione Hero → Impronta

Interviene esclusivamente sui tre problemi descritti nel brief correttivo
(`PETRESONA_V4_FIX_CALENDARIO_TRANSIZIONE_HERO.md`), lasciando invariato il
resto della V4 (componenti 21st.dev reali, sezioni, testi, prezzo).

## 1. File modificati e creati

**Nuovi:**
- `src/components/sections/HeroImprintTransition.tsx`
- `src/components/booking/BetaBookingFlow.tsx`
- `src/components/booking/BetaCalendar.tsx` (esporta anche `TimeSlotPicker`)
- `src/components/booking/BookingSummary.tsx`
- `src/components/booking/BookingConfirmation.tsx`
- `src/lib/booking-preview.ts`
- `src/vite-env.d.ts` (tipizzazione `import.meta.env.VITE_BOOKING_PREVIEW`)
- `.env` (demo con preview attiva), `.env.example` (documentazione, default `false`)

**Modificati:**
- `src/App.tsx` — `<HeroSection /><ImprontaSection />` sostituiti da `<HeroImprintTransition />`.
- `src/components/sections/HeroSection.tsx` — ora `forwardRef`, accetta `exitImageScale`/`exitPanelOpacity`/`exitOverlayOpacity`/`indicatorOpacity` (MotionValue opzionali) per l'uscita coordinata; aggiunto l'indicatore "Continua" verso `#impronta`.
- `src/components/sections/ImprontaSection.tsx` — rimosso `ImprintTrackScope`; `useInView` portato ad `amount: 0.7`; ingresso della foto del gatto regolato a `opacity 0.65→1, scale 1.04→1`.
- `src/components/ui/petresona-imprint-path.tsx` — riscritto: niente più striscia 70-90px sul bordo destro; nuovo tracciato diagonale largo, guidato da `drawProgress`/`fadeOpacity` (MotionValue) invece di un target/offset propri.
- `src/pages/RichiediAccesso.tsx` — il form esistente è stato estratto in `FormArea` (validazioni, errori, focus, checkbox, disclaimer invariati); la pagina delega lo stato complessivo a `BetaBookingFlow` quando la preview è attiva.
- `src/lib/analytics.ts` — aggiunti i 9 eventi `booking_preview_*`, tipizzati nell'unione `AnalyticsEvent` (nessun `as any`).

## 2. Descrizione della transizione Hero → Impronta

`HeroImprintTransition` coordina due `useScroll` indipendenti, nessun pin,
nessuna sezione ad altezza artificiale:

- **Hero (0 → 0.55 stabile, 0.55 → 1 uscita)**: misurato su `heroRef`
  (`offset: ["start start", "end start"]`, il naturale scroll-through della
  sezione). Durante l'uscita: l'immagine scala `1 → 1.06` (wrapper interno
  a `HeroSection`), l'intera hero trasla `y: 0 → -42px` (wrapper esterno in
  `HeroImprintTransition`), il pannello testo/CTA sfuma `opacity 1 → 0.18`,
  un overlay bruno aggiuntivo sale a `0.15`, l'indicatore "Continua" sparisce
  entro il 55% (`opacity 1 → 0` tra 0.4 e 0.55). Nessun blur sul testo,
  nessuna rotazione.
- **Impronta (superficie avorio)**: misurata su un sentinel a altezza zero
  posizionato esattamente dove Impronta inizierebbe nel flusso naturale
  (**non** sull'elemento visivo, che porta il margine negativo — vedi bug
  risolto sotto). `y: 70px → 0`, `clip-path: inset(12% round 56px) →
  inset(0% round 32px)`. Overlap fisso via `margin-top: -7svh` mobile /
  `-12svh` desktop (nel range 10-14svh / 6-8svh richiesto).
- **Traccia rame**: disegnata (`pathLength`) durante l'uscita della hero
  (`heroProgress` 0.35→1), dissolta presto nell'ingresso della superficie
  (`improntaProgress` 0→0.45). Due varianti responsive (`md:block` /
  `md:hidden`) con stroke 4px desktop / 3px mobile via `--imprint-stroke`,
  opacità massima 0.72, `strokeLinecap: round`. Confinata nell'angolo
  inferiore destro della hero: non attraversa mai il cane, il gatto, i testi
  o le CTA (verificato via screenshot a più progressioni di scroll).
- Il titolo di Impronta parte solo quando `useInView` (amount 0.7) rileva
  che almeno il 70% della sezione — coestensiva con la superficie avorio
  che la contiene — è visibile.

### Bug reale trovato e risolto durante il QA
Il primo tentativo posizionava il sentinel di misurazione **sull'elemento
visivo stesso**, che porta il margine negativo per la sovrapposizione. Il
margine negativo faceva sì che `scrollYProgress` fosse già quasi a 1 al
caricamento della pagina (prima di qualunque scroll reale), facendo sparire
la traccia rame (opacità 0) e completare la superficie istantaneamente.
Risolto separando un sentinel a `height:0` privo di margine (misura
corretta) dall'elemento visivo con lo stile (overlap/clip-path). Confermato
via `getComputedStyle` sull'opacità della traccia a più punti di scroll:
`0.72 → 0.62 → 0.28 → 0` (progressione corretta).

## 3. Conferma rimozione del filo

- `ImprintTrackScope` rimosso da `ImprontaSection.tsx` (import e wrapper).
- `grep -rn "ImprintTrackScope"` sul progetto: nessun risultato.
- Verificato via screenshot a 1440×900 e 390×844: nessuna linea verticale
  accanto alla foto del gatto, in nessuna delle due sezioni.

## 4. Tutti i passaggi del calendario beta (verificati uno per uno)

Percorso completo eseguito end-to-end con Playwright, `VITE_BOOKING_PREVIEW=true`:

1. **Richiesta**: form esistente, invariato. Submit vuoto → focus su
   `#fullName` (primo campo non valido), 7 errori mostrati. Submit valido →
   pulsante mostra "Invio in anteprima…".
2. **Richiesta acquisita**: messaggio "La richiesta è stata acquisita nella
   simulazione..." + "Nessun dato è stato trasmesso o salvato." (screenshot
   confermato).
3. **Verifica simulata**: spinner + "Simulazione della verifica di
   coerenza…", durata 850ms (nel range 700-1000ms richiesto).
4. **Approvazione simulata**: "Richiesta approvata nella preview..." + CTA
   "Scegli giorno e orario" (screenshot confermato, progress track a 2/4
   "Verifica" completato).
5. **Scelta giorno**: calendario mensile navigabile (← Mese precedente,
   disabilitato al mese corrente; → Mese successivo), intestazioni
   Lun-Dom, weekend e date passate disabilitati, `aria-label` per data
   (es. "Lunedì 17 Agosto"), data selezionata evidenziata. Selezione via
   mouse **e via tastiera** (`focus()` + `Enter`) entrambe verificate.
6. **Scelta orario**: 4 slot demo (09:30/11:00/14:30/16:00), disponibilità
   deterministica per giorno della settimana (screenshot mostra 14:30
   barrato/disabilitato di lunedì), pulsante "Continua" disabilitato finché
   non si seleziona uno slot, "Cambia giorno" torna indietro.
7. **Riepilogo**: PetResona Impronta, "Primo incontro online", data e
   orario selezionati, durata indicativa, fuso orario Europe/Rome, testo
   "Il pet non deve partecipare alla videochiamata...", azioni "Modifica
   giorno o orario" / "Conferma anteprima".
8. **Conferma preview**: "Anteprima completata.", testo su cosa accadrebbe
   con un'integrazione reale, riepilogo data/orario, "Nessun appuntamento è
   stato realmente prenotato." in evidenza, azioni "Ricomincia la demo" /
   "Torna a PetResona" (screenshot confermato per tutti gli 8 passaggi).

La progressione compatta a 4 fasi (Richiesta/Verifica/Prenotazione/Conferma)
è visibile in ogni schermata dal passaggio 02 in poi, con stato
completato/attivo/futuro corretto.

## 5. Dati dimostrativi utilizzati

- **Date**: prossimi giorni lavorativi (lun-ven) a partire da domani,
  fino a 9 giorni, generati deterministicamente da `getAvailableDates()`
  (nessun `Math.random`).
- **Orari**: 4 slot fissi, disponibilità variabile per giorno della
  settimana via una tabella statica (`SLOT_AVAILABILITY_BY_WEEKDAY`), non
  casuale — gli stessi input producono sempre lo stesso output.

## 6. Conferma: nessuna rete è stata chiamata

`src/lib/booking-preview.ts`, `BetaBookingFlow.tsx`, `BetaCalendar.tsx`,
`BookingSummary.tsx`, `BookingConfirmation.tsx`: nessun `fetch`, `axios`, o
provider esterno. `grep -rn "fetch(\|axios\|XMLHttpRequest" src/components/booking src/lib/booking-preview.ts`
non produce risultati.

## 7. Conferma: nessun dato è stato salvato

Nessun `localStorage`, `sessionStorage`, `document.cookie` o IndexedDB in
nessuno dei file del flusso beta (`grep -rn "localStorage\|sessionStorage\|document.cookie"`
sui file booking produce solo corrispondenze dentro i commenti di
documentazione che dichiarano l'assenza di questi meccanismi — nessuna
occorrenza nel codice eseguito). Lo stato (`step`, `date`, `time`) vive
solo in `useState` di `BetaBookingFlow`: un refresh della pagina riparte
sempre dal passaggio "Richiesta".

## 8. Comportamento con preview attiva e disattivata

| `VITE_BOOKING_PREVIEW` | Comportamento verificato |
| --- | --- |
| `true` | Flusso completo in 8 passaggi dopo un submit valido, come sopra. |
| `false` | Comportamento prudente originale invariato: submit valido → "Integrazione con il backend non ancora collegata in questa anteprima: nessuna richiesta è stata inviata." Nessun passaggio del calendario viene mostrato. Verificato ricompilando con `VITE_BOOKING_PREVIEW=false` e ripetendo il test di submit. |

Il file consegnato ha `.env` con `VITE_BOOKING_PREVIEW=true` (per mostrare
subito la demo) e `.env.example` con `false` come default documentato.

## 9. Dimensioni testate

Con Playwright/Chromium, `index.html` e `richiedi-accesso.html`:

| Viewport | index.html | richiedi-accesso.html |
| --- | --- | --- |
| 390×844 | overflow: nessuno · errori: nessuno | overflow: nessuno · errori: nessuno |
| 430×932 | overflow: nessuno · errori: nessuno | overflow: nessuno · errori: nessuno |
| 768×1024 | overflow: nessuno · errori: nessuno | overflow: nessuno · errori: nessuno |
| 1440×900 | overflow: nessuno · errori: nessuno | overflow: nessuno · errori: nessuno |

**Bug reale trovato e risolto durante questo QA**: a 390×844 e 430×932 la
variante mobile della traccia rame (`right-[-6%] w-[60vw]`) sporgeva di
circa 23px oltre il bordo destro del viewport (`document.body.scrollWidth`
413px su 390px reale). Corretto a `right-0 w-[58vw] max-w-[380px]`;
riverificato: nessun overflow a nessuna delle quattro dimensioni.

`prefers-reduced-motion: reduce` verificato su entrambe le pagine: nessun
errore durante lo scroll, contenuto sempre visibile (la traccia rame non
viene renderizzata affatto — `!prefersReducedMotion &&` guarda entrambe le
istanze in `HeroImprintTransition`; hero e superficie avorio restano
statiche senza `style` di trasformazione).

## 10. Risultato build ed errori ancora aperti

```
npm run build
> tsc -b && vite build
✓ built in ~1.5s
```

Nessun errore TypeScript, nessun errore/warning Vite, nessun errore console
in nessuno dei test sopra (l'unica voce non-200 osservata è la richiesta
automatica del browser per `/favicon.ico`, invariata dalle versioni
precedenti — nessun favicon reale è stato ancora fornito).

**Errori aperti**: nessuno introdotto da questa correzione. Restano
invariati i punti già segnalati in `QA_REPORT_V4_CORRECTED.md` e non
toccati da questo brief (backend del modulo reale non collegato — per
design, la preview beta non lo sostituisce; link legali e dati aziendali
reali mancanti; audit Lighthouse formale non eseguito in questo ambiente).
