/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPLICATION_ENDPOINT?: string
  readonly VITE_PRIVACY_POLICY_URL?: string
  readonly VITE_COOKIE_POLICY_URL?: string
  readonly VITE_TERMS_URL?: string
  readonly VITE_COMPANY_DETAILS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
