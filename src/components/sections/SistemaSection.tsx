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
            className="group border-t border-line py-5 first:border-t-0 md:border-t-2 md:border-t-transparent md:border-l md:border-l-line md:px-8 md:py-8 md:first:border-l-0 md:hover:border-t-copper md:focus-within:border-t-copper"
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
              <p className="pt-3 text-sm leading-relaxed text-brown/70 md:pt-4">{item.desc}</p>
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
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper">
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
              className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-brown/75"
            >
              Abitudini, reazioni e cambiamenti prendono forma anche nella relazione e
              nell'ambiente quotidiano.
              <span className="mt-3 block">
                ResonaPet considera insieme tre elementi inseparabili: animale, persona e
                ambiente.
              </span>
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0.65, scale: 1.04 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: prefersReducedMotion ? 0 : 0.7, duration: motionTokens.image, ease: motionTokens.easeOut as unknown as [number, number, number, number] }}
              className="mt-8 overflow-hidden rounded-[20px] md:hidden"
              style={{ maxHeight: 420, aspectRatio: "4 / 5" }}
            >
              <picture className="block h-full w-full">
                <source media="(max-width: 767px)" srcSet="/assets/images/resonapet-cat-mobile-v2.webp" />
                <img
                  src="/assets/images/resonapet-cat-desktop-v2.webp"
                  alt="Gatto seduto su un divano, osservando lo spazio domestico intorno a sé."
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </picture>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0.65, scale: 1.04 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: motionTokens.image, ease: motionTokens.easeOut as unknown as [number, number, number, number] }}
            className="hidden overflow-hidden rounded-[24px] md:block"
            style={{ aspectRatio: "4 / 3" }}
          >
            <picture className="block h-full w-full">
              <source media="(max-width: 767px)" srcSet="/assets/images/resonapet-cat-mobile-v2.webp" />
              <img
                src="/assets/images/resonapet-cat-desktop-v2.webp"
                alt="Gatto seduto su un divano, osservando lo spazio domestico intorno a sé."
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </picture>
          </motion.div>
        </div>

        <TriadNodes />
      </div>
    </section>
  )
}
