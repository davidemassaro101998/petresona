import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

const TRIAD = [
  {
    key: "animale",
    label: "Animale",
    desc: "La sua storia, le abitudini e ciò che osservi nella vita di ogni giorno.",
  },
  {
    key: "persona",
    label: "Persona",
    desc: "La presenza, i gesti e i ritmi che costruiscono la vostra relazione.",
  },
  {
    key: "ambiente",
    label: "Ambiente",
    desc: "Gli spazi, i suoni e i cambiamenti che accompagnano la sua quotidianità.",
  },
]

function TriadNodes() {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="mt-10 grid gap-1 md:mt-14 md:grid-cols-3 md:gap-0">
      {TRIAD.map((item) => {
        const open = openKey === item.key
        return (
          <div
            key={item.key}
            className="group border-t border-line py-5 first:border-t-0 md:border-t-2 md:border-t-transparent md:first:border-t-2 md:border-l md:border-l-line md:px-8 md:py-8 md:first:border-l-0 md:hover:border-t-copper md:focus-within:border-t-copper"
            onMouseEnter={() => !prefersReducedMotion && setOpenKey(item.key)}
            onMouseLeave={() => !prefersReducedMotion && setOpenKey(null)}
            onFocus={() => setOpenKey(item.key)}
            onBlur={() => setOpenKey(null)}
          >
            <button
              type="button"
              className="flex w-full min-h-[44px] items-center justify-between text-left md:cursor-default"
              aria-expanded={open}
              aria-controls={`triad-panel-${item.key}`}
              onClick={() => {
                const next = open ? null : item.key
                setOpenKey(next)
                if (next) track("system_node_open", { node: item.key })
              }}
            >
              <span className="font-serif text-lg text-ink transition-colors md:text-2xl md:group-hover:text-copper">{item.label}</span>
              <span className="text-copper md:hidden" aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
            <motion.div
              id={`triad-panel-${item.key}`}
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: motionTokens.accordion, ease: motionTokens.easeOut as unknown as [number, number, number, number] }}
              className="overflow-hidden md:!h-auto md:!opacity-100"
            >
              <p className="pt-3 text-[length:var(--text-small)] leading-relaxed text-brown/90 md:pt-4">{item.desc}</p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

export function SistemaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="sistema" className="relative py-16 md:py-20">
      <div ref={ref} className="mx-auto max-w-6xl px-5 md:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper-text">
            Una lettura più ampia
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-[length:var(--text-section)] leading-[1.15] text-ink">
            {prefersReducedMotion || !inView ? (
              prefersReducedMotion && "Quando osservare soltanto il pet non basta."
            ) : (
              <VerticalCutReveal
                splitBy="lines"
                staggerDuration={0.075}
                staggerFrom="first"
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                autoStart
              >
                {"Quando osservare soltanto\nil pet non basta."}
              </VerticalCutReveal>
            )}
          </h2>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: prefersReducedMotion ? 0 : 0.5, duration: motionTokens.text }}
            className="mt-5 max-w-xl text-[length:var(--text-body)] leading-relaxed text-brown/90"
          >
            Abitudini, reazioni e cambiamenti prendono forma anche nella relazione e
            nell'ambiente quotidiano.
            <span className="mt-3 block">
              ResonaPet considera insieme tre elementi inseparabili: animale, persona e
              ambiente.
            </span>
          </motion.p>
        </div>

        <TriadNodes />

      </div>

      <div className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen md:mt-16">
        <div className="relative aspect-[4/5] min-h-[460px] sm:aspect-[16/10] md:aspect-[21/9] md:min-h-[560px]">
          <img
            src="/assets/images/resonapet-dog-riconosci-v1.webp"
            alt="Cane disteso su un cuscino in un soggiorno luminoso, con un vaso in terracotta sullo sfondo."
            className="absolute inset-0 h-full w-full scale-105 object-cover blur-[1.5px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-deep via-brown-deep/70 to-brown-deep/15" />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(60% 65% at 28% 55%, rgba(35,20,15,0.5) 0%, rgba(35,20,15,0.15) 55%, transparent 80%)",
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-10">
              <h3 className="max-w-xl font-serif text-2xl leading-tight text-ivory drop-shadow-[0_2px_10px_rgba(35,20,15,0.5)] md:text-3xl">
                Lo riconosci?
              </h3>
              <div className="mt-5 grid max-w-2xl gap-3 text-[length:var(--text-body)] font-medium italic leading-relaxed text-ivory drop-shadow-[0_2px_10px_rgba(35,20,15,0.5)]">
                <p>
                  Il tremore che comincia ai primi tuoni, e non si ferma nemmeno quando il
                  temporale è già lontano.
                </p>
                <p>I segni lasciati sulla porta, nei minuti in cui provi solo ad allontanarti.</p>
                <p>Un cambiamento improvviso, senza una spiegazione — nemmeno dal veterinario.</p>
                <p>
                  Gli occhi che evitano i tuoi, proprio nei momenti in cui vorresti sentirlo
                  vicino.
                </p>
              </div>
              <p className="mt-5 max-w-2xl text-[length:var(--text-body)] font-medium leading-relaxed text-ivory drop-shadow-[0_2px_10px_rgba(35,20,15,0.5)]">
                Non è colpa di nessuno. È la profondità del legame che segnala qualcosa da
                ascoltare.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mt-12 grid gap-4 border-t border-copper/35 pt-8 md:mt-16 md:grid-cols-[0.75fr_1.25fr] md:gap-12 md:pt-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper-text">
              Il ruolo della biorisonanza
            </p>
            <h3 className="mt-3 font-serif text-2xl leading-tight text-ink md:text-3xl">
              Non tocca. Si sintonizza.
            </h3>
          </div>
          <div className="max-w-2xl text-[length:var(--text-body)] leading-relaxed text-brown/90">
            <p>
              L'energia non ha bisogno di contatto per essere letta. Ogni animale ha una sua
              firma energetica — un'antenna su cui il sistema di biorisonanza integrato
              ResonaPet si sintonizza, ovunque voi siate.
            </p>
            <p className="mt-4">
              Da lì legge tra un vastissimo campo di frequenze, portando alla luce ciò che
              ancora non si vede — spesso proprio quello che chi gli è vicino sentiva, senza
              saperlo spiegare.
            </p>
            <p className="mt-4 text-[length:var(--text-small)]">
              Il lavoro di biorisonanza non produce diagnosi, referti o prescrizioni
              medico-veterinarie e non sostituisce il medico veterinario.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
