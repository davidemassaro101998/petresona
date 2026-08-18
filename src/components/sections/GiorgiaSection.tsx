import { RevealImageMask } from "@/components/ui/reveal-image-mask"

const FACTS = [
  "35 anni di esperienza infermieristica",
  "Oltre 25 anni come kinesiologa e personal trainer",
  "Formazione in tecnologie di biorisonanza avanzata",
  "Oltre 30 anni nella conduzione di un centro olistico",
]

export function GiorgiaSection() {
  return (
    <section id="giorgia" className="bg-forest py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-14 md:px-10">
        {/* TODO: sostituire con fotografia ufficiale approvata prima del go-live. */}
        <RevealImageMask
          src="/assets/images/giorgia-resonapet-portrait-v2.webp"
          alt="Ritratto di Giorgia Bisognin."
          className="aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_24px_50px_-20px_rgba(59,42,34,0.28)]"
          imgClassName="h-full w-full object-cover object-center"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper-light">
            Ideatrice e referente personale
          </p>
          <h2 className="mt-3 font-serif text-[length:var(--text-section)] text-ivory">
            Ogni percorso è seguito personalmente da Giorgia.
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-copper-light">
            Giorgia Bisognin
          </p>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ivory/85">
            Giorgia Bisognin riunisce 35 anni di esperienza infermieristica, oltre 25 anni come
            kinesiologa e personal trainer e oltre trent'anni nella conduzione di un centro olistico.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {FACTS.map((fact) => (
              <span key={fact} className="border-t border-ivory/20 py-2.5 text-[length:var(--text-micro)] text-ivory/85">
                {fact}
              </span>
            ))}
          </div>
          <div className="mt-8 max-w-2xl border-t border-ivory/15 pt-7">
            <h3 className="font-serif text-xl text-ivory md:text-2xl">Ascoltarlo nella sua lingua.</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/85">
              Trent'anni a leggere ciò che il corpo umano non sa dire a parole. Quello stesso
              ascolto, oggi, si rivolge a chi non ha mai avuto le parole per raccontarsi.
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/85">
              ResonaPet nasce da questo passaggio: la relazione con il tuo animale cresce ogni
              volta che trova lo spazio per essere pienamente se stesso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
