import { useEffect, useRef, useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { BetaBookingFlow } from "@/components/booking/BetaBookingFlow"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

const BOOKING_PREVIEW_ENABLED = import.meta.env.VITE_BOOKING_PREVIEW === "true"

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

type Status = "idle" | "loading" | "error"

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

/** Owns the existing form and its validation, untouched. When
 *  `onValidSubmit` is provided (booking preview enabled), a valid submit
 *  hands off to BetaBookingFlow instead of showing the "backend not
 *  connected" message. */
function FormArea({ onValidSubmit }: { onValidSubmit?: () => void }) {
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

    if (onValidSubmit) {
      // Booking preview enabled: no network call here either — just a
      // brief "sending" state before handing off to BetaBookingFlow, which
      // itself makes no network calls and persists nothing.
      await new Promise((resolve) => setTimeout(resolve, 500))
      onValidSubmit()
      return
    }

    // No real backend endpoint is connected in this preview build — see the
    // integration note below the form. Nothing is submitted or simulated as
    // sent; the loading state resolves to an explicit "not connected" error
    // rather than a false success.
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStatus("error")
    setStatusMessage(
      "Integrazione con il backend non ancora collegata in questa anteprima: nessuna richiesta è stata inviata."
    )
    track("application_submit_error", { reason: "no_backend" })
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
                  Che cosa ti ha portato a richiedere PetResona Impronta?
                </label>
                <p className="mt-1 text-xs text-brown/60">
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
                  <label htmlFor="privacyCheck" className="text-[0.85rem] leading-relaxed text-brown/75">
                    Ho letto e accetto{" "}
                    {/* TODO: collegare URL reale informativa privacy */}
                    l'<a href="#" data-privacy-link className="text-ink underline">informativa privacy</a>.
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
                  <label htmlFor="disclaimerCheck" className="text-[0.85rem] leading-relaxed text-brown/75">
                    Comprendo che PetResona Impronta è un servizio personale non veterinario, che
                    non effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non
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
              {status === "loading" ? (onValidSubmit ? "Invio in anteprima…" : "Invio in corso…") : "Invia richiesta"}
            </InteractiveHoverButton>
            <p role="status" aria-live="polite" className="mt-2.5 min-h-[1.2em] text-sm text-copper aria-[hidden=false]:text-red-600">
              {statusMessage}
            </p>

            <p className="mt-4 border-t border-dashed border-line pt-3.5 text-xs leading-relaxed text-brown/55">
              {/* TODO: collegare un endpoint reale via richiesta POST quando disponibile.
                   Fino ad allora il modulo valida i campi ma non invia né simula un invio riuscito. */}
              Punto di integrazione: nessun backend reale è collegato in questa build. Quando sarà
              disponibile un endpoint, collegarlo qui con una richiesta POST, gestendo caricamento,
              successo, errore, doppio invio, honeypot e rate limit lato server.
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
            Pet<b className="text-copper">Resona</b>
          </a>
          <a href="/index.html" className="text-sm font-semibold text-ink">
            ← Torna a PetResona
          </a>
        </div>
      </header>

      <main id="contenuto" className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-10 md:py-20">
          <p className="rounded-xl border border-line bg-ivory px-5 py-3 text-center text-sm text-brown/70">
            Anteprima di sviluppo — il modulo non è ancora collegato a un sistema di invio reale.
            {BOOKING_PREVIEW_ENABLED && " La scelta di data e orario che segue è una demo beta: nessun dato viene inviato o salvato."}
          </p>

          <h1 className="mt-8 font-serif text-[1.9rem] leading-[1.15] text-ink md:text-4xl">
            {prefersReducedMotion ? (
              "Richiedi accesso a PetResona Impronta"
            ) : (
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.05}
                staggerFrom="first"
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                autoStart
              >
                Richiedi accesso a PetResona Impronta
              </VerticalCutReveal>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-brown/75">
            Raccontaci chi è il tuo pet, che cosa osservi nella quotidianità e che cosa ti ha
            portato a richiedere PetResona Impronta. La richiesta verrà esaminata prima di
            procedere con contratto, pagamento e appuntamenti.
          </p>

          {BOOKING_PREVIEW_ENABLED ? (
            <BetaBookingFlow
              renderApplication={({ onValidSubmit }) => <FormArea onValidSubmit={onValidSubmit} />}
            />
          ) : (
            <FormArea />
          )}

          <p className="mt-5 text-xs leading-relaxed text-brown/55">
            PetResona non effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non
            sostituisce il medico veterinario.
          </p>
        </div>
      </main>

      <footer className="border-t border-line px-5 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-brown/65">
          <p className="font-serif text-lg text-ink">
            Pet<b className="text-copper">Resona</b>
          </p>
          <a href="/index.html">← Torna a PetResona</a>
        </div>
        <p className="mx-auto mt-5 max-w-6xl text-[0.78rem] leading-relaxed text-brown/55">
          PetResona Impronta è un servizio personale, non veterinario. Non effettua diagnosi,
          prescrizioni o trattamenti medico-veterinari e non sostituisce il medico veterinario.
          <br />
          Informativa privacy · Cookie policy · Termini e condizioni (link da collegare)
        </p>
        <p className="mx-auto mt-3 max-w-6xl text-[0.68rem] text-brown/40">
          © PetResona Impronta. Dati aziendali (ragione sociale, indirizzo, P.IVA, email) da
          inserire prima della pubblicazione.
        </p>
      </footer>
    </>
  )
}
