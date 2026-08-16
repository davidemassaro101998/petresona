import { useMemo, useState } from "react"
import {
  buildMonthGrid,
  formatDateAriaIt,
  isDateAvailable,
  monthLabelIt,
  sameDay,
  weekdayLabelsIt,
  getSlotsForDate,
  type TimeSlot,
} from "@/lib/booking-preview"

const TRANSITION_MS = 200

/** Passaggio 05 — month calendar, keyboard-navigable, deterministic demo
 *  availability. Current month + next month only (via the nav buttons). */
export function BetaCalendar({
  selected,
  onSelect,
}: {
  selected: Date | null
  onSelect: (date: Date) => void
}) {
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const atMin = cursor.getFullYear() === minMonth.getFullYear() && cursor.getMonth() === minMonth.getMonth()
  const atMax = cursor.getFullYear() === maxMonth.getFullYear() && cursor.getMonth() === maxMonth.getMonth()

  const grid = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  return (
    <div className="rounded-[24px] border border-copper/25 bg-ivory p-5 md:p-6">
      <div className="flex items-center justify-between">
        <p className="font-serif text-lg text-ink">{monthLabelIt(cursor.getFullYear(), cursor.getMonth())}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Mese precedente"
            disabled={atMin}
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30 hover:not-disabled:border-copper"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Mese successivo"
            disabled={atMax}
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-30 hover:not-disabled:border-copper"
          >
            →
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs text-brown/55">Disponibilità dimostrativa</p>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-brown/50">
        {weekdayLabelsIt().map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map(({ date, inMonth }) => {
          const available = inMonth && isDateAvailable(date)
          const isSelected = selected ? sameDay(date, selected) : false
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={!available}
              aria-pressed={isSelected}
              aria-label={`${formatDateAriaIt(date)}${available ? "" : " — non disponibile"}`}
              onClick={() => available && onSelect(date)}
              style={{ transitionDuration: `${TRANSITION_MS}ms` }}
              className={`flex aspect-square min-h-[44px] items-center justify-center rounded-full text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
                !inMonth ? "text-brown/20" : ""
              } ${
                !available && inMonth ? "text-brown/25 line-through" : ""
              } ${
                isSelected
                  ? "bg-copper text-ivory"
                  : available
                    ? "text-ink hover:bg-copper/10"
                    : ""
              }`}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Passaggio 06 — time slots for the already-selected date. */
export function TimeSlotPicker({
  date,
  selected,
  onSelect,
}: {
  date: Date
  selected: string | null
  onSelect: (time: string) => void
}) {
  const slots: TimeSlot[] = useMemo(() => getSlotsForDate(date), [date])

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {slots.map((slot) => {
        const isSelected = selected === slot.time
        return (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            aria-pressed={isSelected}
            onClick={() => slot.available && onSelect(slot.time)}
            className={`min-h-[48px] rounded-[14px] border text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
              !slot.available
                ? "cursor-not-allowed border-line text-brown/25 line-through"
                : isSelected
                  ? "border-copper bg-copper text-ivory"
                  : "border-line text-ink hover:border-copper"
            }`}
          >
            {slot.time}
          </button>
        )
      })}
    </div>
  )
}
