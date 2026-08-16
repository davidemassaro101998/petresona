/**
 * Data layer for the beta booking preview — deliberately separated from
 * the UI (BetaCalendar, BookingSummary, BookingConfirmation) and from any
 * future real provider. Everything here is deterministic (no Math.random,
 * no Date.now()-seeded variance beyond "today"), demo-labeled, and
 * side-effect-free: no network calls, no localStorage/cookies/DB writes.
 *
 * To connect a real provider later (Cal.com, a custom backend, ...):
 * replace the bodies of `getAvailableDates` / `getSlotsForDate` with real
 * fetches and keep the same return shapes — the UI components don't need
 * to change.
 */

export type BookingPreviewStep =
  | "application"
  | "submitted"
  | "review"
  | "approved"
  | "date"
  | "time"
  | "summary"
  | "confirmed"

export const STEP_ORDER: BookingPreviewStep[] = [
  "application",
  "submitted",
  "review",
  "approved",
  "date",
  "time",
  "summary",
  "confirmed",
]

/** The 4-stage compact progress shown throughout the flow. */
export type ProgressStage = "richiesta" | "verifica" | "prenotazione" | "conferma"

export const PROGRESS_STAGES: { key: ProgressStage; label: string }[] = [
  { key: "richiesta", label: "Richiesta" },
  { key: "verifica", label: "Verifica" },
  { key: "prenotazione", label: "Prenotazione" },
  { key: "conferma", label: "Conferma" },
]

export function stageForStep(step: BookingPreviewStep): ProgressStage {
  switch (step) {
    case "application":
    case "submitted":
      return "richiesta"
    case "review":
    case "approved":
      return "verifica"
    case "date":
    case "time":
    case "summary":
      return "prenotazione"
    case "confirmed":
      return "conferma"
  }
}

export interface TimeSlot {
  time: string
  available: boolean
}

const MASTER_SLOTS = ["09:30", "11:00", "14:30", "16:00"] as const

/** Demo slot availability per weekday index (1=Monday..5=Friday) — varies
 *  day to day but is entirely deterministic, so tests stay repeatable. */
const SLOT_AVAILABILITY_BY_WEEKDAY: Record<number, boolean[]> = {
  1: [true, true, false, true],
  2: [true, false, true, true],
  3: [false, true, true, false],
  4: [true, true, true, false],
  5: [true, false, false, true],
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

function atMidnight(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Demo availability: the next working days (Mon-Fri), starting tomorrow,
 *  up to `count` days. Deterministic — no randomness. */
export function getAvailableDates(count = 9, from: Date = new Date()): Date[] {
  const dates: Date[] = []
  const cursor = atMidnight(from)
  cursor.setDate(cursor.getDate() + 1)
  while (dates.length < count) {
    if (!isWeekend(cursor)) {
      dates.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export function isDateAvailable(date: Date): boolean {
  const today = atMidnight(new Date())
  if (atMidnight(date) <= today) return false
  if (isWeekend(date)) return false
  return getAvailableDates(9).some((d) => sameDay(d, date))
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Demo time slots for a given date — deterministic per weekday. */
export function getSlotsForDate(date: Date): TimeSlot[] {
  const weekday = date.getDay()
  const pattern = SLOT_AVAILABILITY_BY_WEEKDAY[weekday] ?? [true, true, true, true]
  return MASTER_SLOTS.map((time, i) => ({ time, available: pattern[i] ?? true }))
}

const WEEKDAY_LABELS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
const MONTH_LABELS_IT = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
]

export function weekdayLabelsIt(): string[] {
  return WEEKDAY_LABELS_IT
}

export function monthLabelIt(year: number, month: number): string {
  return `${MONTH_LABELS_IT[month]} ${year}`
}

/** Builds a Monday-first calendar grid for the given year/month, including
 *  the leading/trailing days from adjacent months needed to fill the
 *  weeks, each flagged with whether it belongs to the target month. */
export function buildMonthGrid(year: number, month: number): { date: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1)
  // JS getDay(): 0=Sun..6=Sat. Convert to Monday-first index (0=Mon..6=Sun).
  const firstWeekdayMondayFirst = (first.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - firstWeekdayMondayFirst)

  const cells: { date: Date; inMonth: boolean }[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    cells.push({ date: d, inMonth: d.getMonth() === month })
  }
  // Trim trailing all-out-of-month week rows (keeps the grid compact).
  while (cells.length > 35 && cells.slice(-7).every((c) => !c.inMonth)) {
    cells.splice(-7, 7)
  }
  return cells
}

export function formatDateLongIt(date: Date): string {
  const weekdayFull = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ][date.getDay()]
  return `${weekdayFull} ${date.getDate()} ${MONTH_LABELS_IT[date.getMonth()]}`
}

export function formatDateAriaIt(date: Date): string {
  return formatDateLongIt(date)
}
