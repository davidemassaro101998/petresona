import { useEffect, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BetaCalendar, TimeSlotPicker } from "@/components/booking/BetaCalendar"
import { BookingSummary } from "@/components/booking/BookingSummary"
import { BookingConfirmation } from "@/components/booking/BookingConfirmation"
import {
  PROGRESS_STAGES,
  stageForStep,
  type BookingPreviewStep,
} from "@/lib/booking-preview"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

const REVIEW_DELAY_MS = 850 // within the brief's 700-1000ms window

function StepShell({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function ProgressTrack({ step }: { step: BookingPreviewStep }) {
  const activeStage = stageForStep(step)
  const activeIndex = PROGRESS_STAGES.findIndex((s) => s.key === activeStage)

  return (
    <ol className="mb-8 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold sm:gap-3" aria-label="Avanzamento della preview">
      {PROGRESS_STAGES.map((stage, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming"
        return (
          <li key={stage.key} className="flex shrink-0 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] ${
                state === "done"
                  ? "border-copper bg-copper text-ivory"
                  : state === "active"
                    ? "border-copper text-copper"
                    : "border-line text-brown/35"
              }`}
              aria-hidden="true"
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            <span className={state === "upcoming" ? "text-brown/35" : "text-ink"}>{stage.label}</span>
            {i < PROGRESS_STAGES.length - 1 && <span className="mx-1 h-px w-4 shrink-0 bg-line" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

export interface BetaBookingFlowProps {
  /** Renders the existing application form (step "application" only).
   *  Call `onValidSubmit` after the form's own validation passes. */
  renderApplication: (helpers: { onValidSubmit: () => void }) => ReactNode
}

/**
 * Orchestrates the 8-step beta booking preview. Step "application" delegates
 * back to the caller's existing form via `renderApplication` — this
 * component never re-implements or duplicates it. No network requests, no
 * localStorage/cookie/DB writes anywhere in this file.
 */
export function BetaBookingFlow({ renderApplication }: BetaBookingFlowProps) {
  const [step, setStep] = useState<BookingPreviewStep>("application")
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    track("booking_preview_start")
  }, [])

  useEffect(() => {
    if (step === "submitted") {
      track("booking_preview_application_valid")
      const t = setTimeout(() => setStep("review"), 1400)
      return () => clearTimeout(t)
    }
    if (step === "review") {
      track("booking_preview_review")
      const t = setTimeout(() => setStep("approved"), REVIEW_DELAY_MS)
      return () => clearTimeout(t)
    }
    if (step === "approved") {
      track("booking_preview_approved")
    }
    if (step === "summary") {
      track("booking_preview_summary")
    }
  }, [step])

  if (step === "application") {
    return renderApplication({ onValidSubmit: () => setStep("submitted") })
  }

  return (
    <div className="mt-9">
      <ProgressTrack step={step} />

      <AnimatePresence mode="wait">
        {step === "submitted" && (
          <StepShell key="submitted">
            <div className="rounded-[24px] border border-copper/25 bg-ivory p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copper">Anteprima beta</p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink">
                La richiesta è stata acquisita nella simulazione.
                <br />
                In produzione verrebbe inviata a Giorgia per la valutazione.
              </p>
              <p className="mt-4 text-sm font-semibold text-brown/60">
                Nessun dato è stato trasmesso o salvato.
              </p>
            </div>
          </StepShell>
        )}

        {step === "review" && (
          <StepShell key="review">
            <div className="flex items-center gap-3 rounded-[24px] border border-copper/25 bg-ivory p-6 md:p-8">
              <span
                className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-copper border-t-transparent"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-ink">Simulazione della verifica di coerenza…</p>
            </div>
          </StepShell>
        )}

        {step === "approved" && (
          <StepShell key="approved">
            <div className="rounded-[24px] border border-copper/25 bg-ivory p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copper">Preview beta</p>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-ink">
                Richiesta approvata nella preview.
                <br />
                Ora puoi provare la scelta del primo incontro.
              </p>
              <button
                type="button"
                onClick={() => setStep("date")}
                className="mt-6 min-h-[48px] w-full rounded-full bg-copper text-sm font-semibold text-ivory transition-colors hover:bg-brown sm:w-auto sm:px-8"
              >
                Scegli giorno e orario
              </button>
            </div>
          </StepShell>
        )}

        {step === "date" && (
          <StepShell key="date">
            <p className="mb-4 text-sm text-brown/70">Seleziona un giorno disponibile.</p>
            <BetaCalendar
              selected={date}
              onSelect={(d) => {
                setDate(d)
                track("booking_preview_date_selected")
                setStep("time")
              }}
            />
          </StepShell>
        )}

        {step === "time" && date && (
          <StepShell key="time">
            <p className="mb-4 text-sm text-brown/70">
              Orari dimostrativi per {date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}.
            </p>
            <TimeSlotPicker
              date={date}
              selected={time}
              onSelect={(t) => {
                setTime(t)
                track("booking_preview_time_selected")
              }}
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                disabled={!time}
                onClick={() => setStep("summary")}
                className="min-h-[48px] flex-1 rounded-full bg-copper text-sm font-semibold text-ivory transition-colors hover:bg-brown disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-8"
              >
                Continua
              </button>
              <button
                type="button"
                onClick={() => setStep("date")}
                className="min-h-[48px] flex-1 rounded-full border border-line text-sm font-semibold text-ink transition-colors hover:border-copper sm:flex-none sm:px-6"
              >
                Cambia giorno
              </button>
            </div>
          </StepShell>
        )}

        {step === "summary" && date && time && (
          <StepShell key="summary">
            <BookingSummary
              date={date}
              time={time}
              onEdit={() => setStep("date")}
              onConfirm={() => {
                track("booking_preview_complete")
                setStep("confirmed")
              }}
            />
          </StepShell>
        )}

        {step === "confirmed" && date && time && (
          <StepShell key="confirmed">
            <BookingConfirmation
              date={date}
              time={time}
              onRestart={() => {
                track("booking_preview_restart")
                setDate(null)
                setTime(null)
                setStep("application")
              }}
              onBackHome={() => {}}
            />
          </StepShell>
        )}
      </AnimatePresence>
    </div>
  )
}
