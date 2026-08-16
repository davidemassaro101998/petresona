import { formatDateLongIt } from "@/lib/booking-preview"

/** Passaggio 08 — conferma della preview (mai una prenotazione reale). */
export function BookingConfirmation({
  date,
  time,
  onRestart,
  onBackHome,
}: {
  date: Date
  time: string
  onRestart: () => void
  onBackHome: () => void
}) {
  return (
    <div className="rounded-[24px] border border-copper/25 bg-ivory p-6 text-center md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-copper">Preview beta</p>
      <h3 className="mt-2 font-serif text-2xl text-ink">Anteprima completata.</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brown/75">
        In una versione collegata, a questo punto l'appuntamento verrebbe registrato e riceveresti
        la conferma via email.
      </p>

      <dl className="mx-auto mt-6 grid max-w-xs gap-2 text-sm">
        <div className="flex items-center justify-between border-t border-line pt-3">
          <dt className="text-brown/75">Data</dt>
          <dd className="font-semibold text-ink">{formatDateLongIt(date)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pb-1 pt-3">
          <dt className="text-brown/75">Orario</dt>
          <dd className="font-semibold text-ink">{time}</dd>
        </div>
      </dl>

      <p className="mt-6 rounded-[14px] border border-dashed border-line bg-paper px-4 py-3 text-xs leading-relaxed text-brown/70">
        Nessun appuntamento è stato realmente prenotato.
      </p>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-[48px] flex-1 rounded-full border border-line text-sm font-semibold text-ink transition-colors hover:border-copper sm:max-w-[220px]"
        >
          Ricomincia la demo
        </button>
        <a
          href="/index.html"
          onClick={onBackHome}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-copper text-sm font-semibold text-ivory transition-colors hover:bg-brown sm:max-w-[220px]"
        >
          Torna a ResonaPet
        </a>
      </div>
    </div>
  )
}
