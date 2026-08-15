# PetResona — landing page

Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion.
Componenti interattivi presi dal codice reale di [21st.dev](https://21st.dev) (installati via `shadcn add`), adattati all'identità PetResona — vedi commenti nei singoli file per cosa è stato modificato rispetto all'originale e perché.

## Sviluppo

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Struttura

- `src/app/` — layout, metadata SEO/OG, font (Newsreader + Manrope via `next/font`, self-hosted).
- `src/components/site/` — le sezioni della pagina (hero, modello, come funziona, offerta, calendario, FAQ, ecc.).
- `src/components/ui/` — primitive shadcn + componenti 21st.dev adattati.
- `src/components/blocks/scroll-expansion-hero.tsx` — hero cinematografica (21st.dev, adattata: colori, font, e un fix al listener di scroll che altrimenti rompeva i link ad ancora come `#calendario`).
- `public/images/` — WebP di produzione.
- `design/masters/` — PNG originali ad alta risoluzione (non serviti dal sito, solo archivio).

## Cosa manca prima della pubblicazione (segnato `da confermare` nel codice/UI)

- Collegamento a un provider di prenotazione reale (Calendly/Cal.com o altro) — l'`AppointmentPicker` attuale è funzionale ma con slot statici.
- Dati societari, contatti, P.IVA nel footer.
- Privacy Policy / Cookie Policy / Termini (pagine non ancora create).
- Verifica di Giorgia sulla somiglianza del ritratto (asset generato da riferimenti avatar, vedi brief).
- Esperienze/testimonianze reali (sezione intenzionalmente rimossa finché non ci sono liberatorie).
