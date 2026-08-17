import { useEffect, useRef, useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

const APPLICATION_ENDPOINT = import.meta.env.VITE_APPLICATION_ENDPOINT?.trim()
const PRIVACY_POLICY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL?.trim()
const COOKIE_POLICY_URL = import.meta.env.VITE_COOKIE_POLICY_URL?.trim()
const TERMS_URL = import.meta.env.VITE_TERMS_URL?.trim()
const COMPANY_DETAILS = import.meta.env.VITE_COMPANY_DETAILS?.trim()

const MESSAGES = {
  required: "Questo campo è obbligatorio.",
  email: "Inserisci un indirizzo email valido.",
  privacyCheck: "Devi accettare l'informativa privacy.",
  disclaimerCheck: "Devi confermare di aver compreso il perimetro del servizio.",
}

type FieldName =
  | "fullName"
  | "email"
  | "petType"
  | "petName"
  | "reason"
  | "privacyCheck"
  | "disclaimerCheck"

const REQUIRED: FieldName[] = [
  "fullName",
  "email",
  "petType",
  "petName",
  "reason",
  "privacyCheck",
  "disclaimerCheck",
]

type Status = "idle" | "loading" | "success" | "error"

function FormGroup({ children, delay }: { children: React.ReactNode; delay: number }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: prefersReducedMotion ? 0 : delay, duration: motionTokens.micro * 2 }}
    >
      {children}
    </motion.div>
  )
}

function FormArea() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    track("application_view")
  }, [])

  function validateField(name: FieldName): boolean {
    const form = formRef.current
    if (!form) return true
    const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
    if (!el) return true
    const isCheckbox = el instanceof HTMLInputElement && el.type === "checkbox"
    const value = isCheckbox ? (el as HTMLInputElement).checked : el.value.trim()
    let message = ""
    let invalid = false
    if (!value) {
      invalid = true
      message = isCheckbox
        ? name === "privacyCheck"
          ? MESSAGES.privacyCheck
          : MESSAGES.disclaimerCheck
        : MESSAGES.required
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
      invalid = true
      message = MESSAGES.email
    }
    setErrors((prev) => ({ ...prev, [name]: invalid ? message : undefined }))
    return !invalid
  }

  function handleChange() {
    if (!started) {
      setStarted(true)
      track("application_start")
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "loading") return

    const results = REQUIRED.map((name) => validateField(name))
    const allValid = results.every(Boolean)

    if (!allValid) {
      setStatus("error")
      setStatusMessage("Controlla i campi evidenziati e riprova.")
      track("application_submit_error")
      const firstInvalidName = REQUIRED.find((_name, i) => !results[i])
      if (firstInvalidName) {
        const el = formRef.current?.elements.namedItem(firstInvalidName) as HTMLElement | null
        el?.focus()
      }
      return
    }

    setStatus("loading")

    const form = formRef.current
    if (!form) return
    const data = new FormData(form)

    // Campo esca: i visitatori reali non lo vedono. Se viene compilato,
    // trattiamo la richiesta come completata senza trasmettere dati.
    if (String(data.get("website") ?? "").trim()) {
      setStatus("success")
      setStatusMessage("Richiesta ricevuta.")
      return
    }

    if (!APPLICATION_ENDPOINT) {
      setStatus("error")
      setStatusMessage("Il modulo non è ancora attivo. Riprova più tardi.")
      track("application_submit_error", { reason: "endpoint_unavailable" })
      return
    }

    try {
      const response = await fetch(APPLICATION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          petType: data.get("petType"),
          petName: data.get("petName"),
          reason: data.get("reason"),
          privacyAccepted: data.get("privacyCheck") === "on",
          serviceScopeAccepted: data.get("disclaimerCheck") === "on",
          source: "resonapet-website",
        }),
      })

      if (!response.ok) throw new Error(`Request failed: ${response.status}`)

      form.reset()
      setErrors({})
      setStatus("success")
      setStatusMessage("Richiesta inviata. Riceverai una risposta dopo la valutazione del caso.")
      track("application_submit_success")
    } catch {
      setStatus("error")
      setStatusMessage("Non è stato possibile inviare la richiesta. Riprova tra qualche minuto.")
      track("application_submit_error", { reason: "request_failed" })
    }
  }

  return (
    <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            onChange={handleChange}
            className="mt-9 rounded-[24px] border border-line bg-ivory p-7 md:p-9"
          >
            <div className="grid gap-5">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Sito web</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormGroup delay={0.02}>
                  <label htmlFor="fullName" className="text-sm font-semibold text-ink">
                    Nome e cognome
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby="fullName-err"
                    onBlur={() => validateField("fullName")}
                    className="mt-1.5 min-h-[44px] w-full rounded-[10px] border border-line bg-paper px-3.5 py-3 text-sm text-ink aria-[invalid=true]:border-red-500"
                  />
                  <p id="fullName-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                    {errors.fullName}
                  </p>
                </FormGroup>
                <FormGroup delay={0.05}>
                  <label htmlFor="email" className="text-sm font-semibold text-ink">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="email-err"
                    onBlur={() => validateField("email")}
                    className="mt-1.5 min-h-[44px] w-full rounded-[10px] border border-line bg-paper px-3.5 py-3 text-sm text-ink aria-[invalid=true]:border-red-500"
                  />
                  <p id="email-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                    {errors.email}
                  </p>
                </FormGroup>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormGroup delay={0.08}>
                  <label htmlFor="petType" className="text-sm font-semibold text-ink">
                    Cane o gatto
                  </label>
                  <select
                    id="petType"
                    name="petType"
                    required
                    aria-invalid={Boolean(errors.petType)}
                    aria-describedby="petType-err"
                    onBlur={() => validateField("petType")}
                    className="mt-1.5 min-h-[44px] w-full rounded-[10px] border border-line bg-paper px-3.5 py-3 text-sm text-ink"
                  >
                    <option value="">Seleziona…</option>
                    <option value="cane">Cane</option>
                    <option value="gatto">Gatto</option>
                  </select>
                  <p id="petType-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                    {errors.petType}
                  </p>
                </FormGroup>
                <FormGroup delay={0.11}>
                  <label htmlFor="petName" className="text-sm font-semibold text-ink">
                    Nome del pet
                  </label>
                  <input
                    id="petName"
                    name="petName"
                    type="text"
                    required
                    aria-invalid={Boolean(errors.petName)}
                    aria-describedby="petName-err"
                    onBlur={() => validateField("petName")}
                    className="mt-1.5 min-h-[44px] w-full rounded-[10px] border border-line bg-paper px-3.5 py-3 text-sm text-ink aria-[invalid=true]:border-red-500"
                  />
                  <p id="petName-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                    {errors.petName}
                  </p>
                </FormGroup>
              </div>

              <FormGroup delay={0.14}>
                <label htmlFor="reason" className="text-sm font-semibold text-ink">
                  Che cosa ti ha portato a richiedere ResonaPet?
                </label>
                <p className="mt-1 text-[length:var(--text-micro)] text-brown/90">
                  Descrivi brevemente ciò che osservi nella quotidianità e che cosa desideri
                  comprendere meglio. Non inserire diagnosi, referti o informazioni sanitarie.
                </p>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={4}
                  aria-invalid={Boolean(errors.reason)}
                  aria-describedby="reason-err"
                  onBlur={() => validateField("reason")}
                  className="mt-1.5 min-h-[100px] w-full rounded-[10px] border border-line bg-paper px-3.5 py-3 text-sm text-ink aria-[invalid=true]:border-red-500"
                />
                <p id="reason-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                  {errors.reason}
                </p>
              </FormGroup>

              <FormGroup delay={0.17}>
                <div className="flex items-start gap-2.5">
                  <input
                    id="privacyCheck"
                    name="privacyCheck"
                    type="checkbox"
                    required
                    aria-invalid={Boolean(errors.privacyCheck)}
                    aria-describedby="privacyCheck-err"
                    onBlur={() => validateField("privacyCheck")}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--color-copper)]"
                  />
                  <label htmlFor="privacyCheck" className="text-[length:var(--text-micro)] leading-relaxed text-brown/90">
                    Ho letto e accetto l'{PRIVACY_POLICY_URL ? (
                      <a href={PRIVACY_POLICY_URL} className="text-ink underline underline-offset-2">
                        informativa privacy
                      </a>
                    ) : (
                      <span>informativa privacy</span>
                    )}.
                  </label>
                </div>
                <p id="privacyCheck-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                  {errors.privacyCheck}
                </p>
              </FormGroup>

              <FormGroup delay={0.2}>
                <div className="flex items-start gap-2.5">
                  <input
                    id="disclaimerCheck"
                    name="disclaimerCheck"
                    type="checkbox"
                    required
                    aria-invalid={Boolean(errors.disclaimerCheck)}
                    aria-describedby="disclaimerCheck-err"
                    onBlur={() => validateField("disclaimerCheck")}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--color-copper)]"
                  />
                  <label htmlFor="disclaimerCheck" className="text-[length:var(--text-micro)] leading-relaxed text-brown/90">
                    Comprendo che ResonaPet è un servizio personale non veterinario, che non
                    effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non
                    sostituisce il medico veterinario.
                  </label>
                </div>
                <p id="disclaimerCheck-err" className="mt-1 min-h-[1em] text-xs text-red-600">
                  {errors.disclaimerCheck}
                </p>
              </FormGroup>
            </div>

            <InteractiveHoverButton
              type="submit"
              disabled={status === "loading"}
              className="mt-2 flex w-full"
            >
              {status === "loading" ? "Invio in corso…" : "Invia la richiesta"}
            </InteractiveHoverButton>
            <p
              role="status"
              aria-live="polite"
              className={`mt-2.5 min-h-[1.2em] text-sm ${status === "success" ? "text-forest" : status === "error" ? "text-red-700" : "text-copper-text"}`}
            >
              {statusMessage}
            </p>
    </form>
  )
}

export default function RichiediAccesso() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <>
      <a className="skip-link" href="#contenuto">
        Salta al contenuto
      </a>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-10">
          <a href="/index.html" className="font-serif text-lg text-ink">
            Resona<b className="text-copper">Pet</b>
          </a>
          <a href="/index.html" className="text-sm font-semibold text-ink">
            ← Torna a ResonaPet
          </a>
        </div>
      </header>

      <main id="contenuto" className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-10 md:py-20">
          <h1 className="font-serif text-[length:var(--text-section)] leading-[1.15] text-ink">
            {prefersReducedMotion ? (
              "Richiedi l'accesso a ResonaPet"
            ) : (
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.05}
                staggerFrom="first"
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                autoStart
              >
                Richiedi l'accesso a ResonaPet
              </VerticalCutReveal>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-[length:var(--text-body)] leading-relaxed text-brown/90">
            Raccontaci chi è il tuo pet, che cosa osservi nella quotidianità e che cosa ti ha
            portato a ResonaPet. Ogni richiesta viene esaminata prima di proporre il percorso e
            procedere con contratto, pagamento e appuntamenti.
          </p>

          <FormArea />
        </div>
      </main>

      <footer className="border-t border-line px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-brown/90">
          <p className="font-serif text-lg text-ink">
            Resona<b className="text-copper">Pet</b>
          </p>
          <a href="/index.html">← Torna a ResonaPet</a>
        </div>
        <p className="mx-auto mt-5 max-w-6xl text-[length:var(--text-micro)] leading-relaxed text-brown/90">
          ResonaPet è un servizio personale, non veterinario. Non effettua diagnosi, prescrizioni
          o trattamenti medico-veterinari e non sostituisce il medico veterinario.
        </p>
        <nav aria-label="Informazioni legali" className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-x-5 gap-y-2 text-[length:var(--text-micro)] text-brown/90">
          {PRIVACY_POLICY_URL && <a href={PRIVACY_POLICY_URL}>Informativa privacy</a>}
          {COOKIE_POLICY_URL && <a href={COOKIE_POLICY_URL}>Cookie policy</a>}
          {TERMS_URL && <a href={TERMS_URL}>Termini e condizioni</a>}
        </nav>
        <p className="mx-auto mt-4 max-w-6xl text-[length:var(--text-micro)] text-brown/90">
          © ResonaPet{COMPANY_DETAILS ? ` · ${COMPANY_DETAILS}` : ""}
        </p>
      </footer>
    </>
  )
}
