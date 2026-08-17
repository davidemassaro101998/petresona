# ResonaPet

Sito Vite + React + TypeScript predisposto per Railway.

## Avvio locale

```bash
npm ci
npm run dev
```

## Verifica produzione

```bash
npm run build
npm run lint
```

## Configurazione prima del go-live

Copia `.env.example` in `.env` o configura le stesse variabili su Railway:

- `VITE_APPLICATION_ENDPOINT`: endpoint Odoo o middleware per le richieste;
- `VITE_PRIVACY_POLICY_URL`: informativa privacy;
- `VITE_COOKIE_POLICY_URL`: cookie policy;
- `VITE_TERMS_URL`: termini e condizioni;
- `VITE_COMPANY_DETAILS`: dati aziendali sintetici da mostrare nel footer.

La pagina di richiesta resta `noindex` finché endpoint, informative e flusso Odoo non sono attivi.
La collaborazione veterinaria è predisposta in `VeterinariaSection.tsx` e rimane nascosta finché
`VET_COLLAB_ENABLED` resta impostato su `false`.
