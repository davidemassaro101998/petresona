/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" enables the front-end-only beta booking flow on
   *  /richiedi-accesso.html. No network calls, no persistence — see
   *  src/lib/booking-preview.ts and README.md. Defaults to disabled. */
  readonly VITE_BOOKING_PREVIEW?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
