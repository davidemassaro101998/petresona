import { formatDateLongIt } from "@/lib/booking-preview"

/** Passaggio 07 — riepilogo prima della conferma. */
export function BookingSummary({
  date,
  time,
  onEdit,
  onConfirm,
}: {
  date: Date
  time: string
  onEdit: () => void
  onConfirm: () => void
}) {
  return (
    <div className="rounded-[24px] border border-copper/25 bg-ivory p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copper">
        Riepilogo · Preview beta
      </p>
      <h3 className="mt-2 font-serif text-2xl text-ink">PetResona Impronta</h3>
      <p className="mt-1 text-sm text-brown/70">Primo incontro online</p>

      <dl className="mt-6 grid gap-3 text-sm">
        <div className="flex items-center justify-between border-t border-line pt-3">
          <dt className="text-brown/60">Data selezionata</dt>
          <dd className="font-semibold text-ink">{formatDateLongIt(date)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <dt className="text-brown/60">Orario selezionato</dt>
          <dd className="font-semibold text-ink">{time}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3">
          <dt className="text-brown/60">Durata indicativa</dt>
          <dd className="font-semibold text-ink">45 minuti</dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pb-1 pt-3">
          <dt className="text-brown/60">Fuso orario</dt>
          <dd className="font-semibold text-ink">Europe/Rome</dd>
        </div>
      </dl>

      <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-brown/70">
        Il pet non deve partecipare alla videochiamata. Le fotografie e i materiali richiesti
        verranno raccolti separatamente.
      </p>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onEdit}
          className="min-h-[48px] flex-1 rounded-full border border-line text-sm font-semibold text-ink transition-colors hover:border-copper"
        >
          Modifica giorno o orario
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-[48px] flex-1 rounded-full bg-copper text-sm font-semibold text-ivory transition-colors hover:bg-brown"
        >
          Conferma anteprima
        </button>
      </div>
    </div>
  )
}
