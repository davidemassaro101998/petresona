import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { SpatialProductShowcase, type ShowcaseItem } from "@/components/ui/spatial-product-showcase"
import { track } from "@/lib/analytics"

function AudioMock() {
  const bars = [40, 70, 50, 90, 35, 65, 45, 80, 55, 30]
  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-ivory p-7">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">
        Ambiente indicato
      </p>
      <div className="mt-4 flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-ivory">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="flex h-8 flex-1 items-end gap-[3px]">
          {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-sm bg-copper-light" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <p className="mt-3 text-[0.78rem] text-brown/70">Durata indicativa · Anteprima visiva</p>
    </div>
  )
}

function CodeMock() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-ivory p-7">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">
        Codice Impronta
      </p>
      <p className="mt-3.5 rounded-xl border border-dashed border-line py-3.5 text-center font-serif text-xl tracking-[0.06em] text-ink">
        CODICE IMPRONTA
      </p>
      <div className="mt-4 flex items-center gap-2.5 text-[0.78rem] text-brown/70">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-copper" />
        Schema di collocazione indicativo
      </div>
    </div>
  )
}

function DocMock() {
  const fields = [
    { name: "Nome del pet", width: "70%" },
    { name: "Data", width: "45%" },
    { name: "Indicazioni", width: "85%" },
  ]
  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-ivory p-7">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-copper">
        Guida Impronta · Anteprima visiva
      </p>
      <div className="mt-3.5 grid gap-3">
        {fields.map((f) => (
          <div key={f.name} className="border-b border-line pb-2">
            <p className="text-[0.7rem] uppercase tracking-[0.08em] text-brown/70">{f.name}</p>
            <div className="mt-1 h-3 rounded-sm bg-copper-light/55" style={{ width: f.width }} />
          </div>
        ))}
      </div>
    </div>
  )
}

const ITEMS: ShowcaseItem[] = [
  {
    index: "01",
    label: "Traccia d'Ambiente",
    description:
      "Una traccia audio preparata per lo spazio scelto, con le indicazioni per inserirla nella quotidianità.",
    visual: <AudioMock />,
  },
  {
    index: "02",
    label: "Codice Impronta",
    description:
      "Un codice alfanumerico creato come segno identificativo dell'Impronta, accompagnato dal punto preciso in cui collocarlo.",
    visual: <CodeMock />,
  },
  {
    index: "03",
    label: "Guida Impronta",
    description:
      "Il documento personale che riunisce gli elementi preparati, le modalità di utilizzo e le indicazioni finali.",
    visual: <DocMock />,
  },
]

export function CosaRiceviSection() {
  return (
    <section id="cosa-ricevi" className="bg-ivory/60 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <h2 className="max-w-2xl font-serif text-[1.9rem] leading-[1.15] text-ink md:text-4xl">
          L'Impronta prende forma in tre elementi.
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-brown/75">
          Preparati personalmente da Giorgia dopo l'incontro iniziale e il lavoro con CIEM System.
          Durante la consegna ricevi anche le indicazioni semplici e precise per utilizzarli.
        </p>

        <div
          className="mt-10 md:mt-14"
          onClickCapture={() => track("showcase_item_change")}
        >
          <SpatialProductShowcase items={ITEMS} />
        </div>

        <div className="mt-10">
          <InteractiveHoverButton href="/richiedi-accesso.html" onClick={() => track("access_cta_click")}>
            Richiedi accesso
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  )
}
