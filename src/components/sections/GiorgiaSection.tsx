import { RevealImageMask } from "@/components/ui/reveal-image-mask"

const FACTS = [
  "35 anni di esperienza infermieristica",
  "Kinesiologa e posturologa",
  "Formazione nell'utilizzo del CIEM System",
  "Oltre 30 anni nella conduzione di un centro olistico",
]

export function GiorgiaSection() {
  return (
    <section id="giorgia" className="bg-forest py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-14 md:px-10">
        <RevealImageMask
          src="/assets/images/giorgia-petresona-portrait-v2.webp"
          alt="Ritratto di Giorgia Bisognin."
          className="aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_24px_50px_-20px_rgba(59,42,34,0.28)]"
          imgClassName="h-full w-full object-cover object-center"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper-light">
            Ideatrice e referente personale
          </p>
          <h2 className="mt-3 font-serif text-[1.8rem] text-ivory md:text-4xl">
            Giorgia segue personalmente ogni Impronta.
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-copper-light">
            Giorgia Bisognin
          </p>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ivory/85">
            Giorgia Bisognin riunisce 35 anni di esperienza infermieristica, il lavoro in
            kinesiologia e posturologia e oltre trent'anni nella conduzione di un centro olistico.
            <span className="mt-3 block">
              PetResona nasce da questa esperienza: osservare l'animale senza separarlo dalla
              persona e dall'ambiente in cui vive.
            </span>
          </p>
          <p className="mt-3 text-sm text-ivory/70">
            PetResona è un servizio autonomo e non veterinario. Il percorso viene seguito
            personalmente da Giorgia.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {FACTS.map((fact) => (
              <span key={fact} className="border-t border-ivory/20 py-2.5 text-[0.85rem] text-ivory/75">
                {fact}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
