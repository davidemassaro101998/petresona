import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.footer
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="border-t border-line px-5 py-11 md:px-10"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-5 text-sm text-brown/65">
        <p className="font-serif text-lg text-ink">
          Pet<b className="text-copper">Resona</b>
        </p>
        <nav aria-label="Link footer" className="flex flex-wrap gap-5">
          <a href="#come-si-svolge">Come funziona</a>
          <a href="#cosa-ricevi">Cosa ricevi</a>
          <a href="#giorgia">Giorgia</a>
          <a href="#faq">FAQ</a>
          <a href="/richiedi-accesso.html">Richiedi accesso</a>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-[0.78rem] leading-relaxed text-brown/55">
        PetResona Impronta è un servizio personale, non veterinario. Non effettua diagnosi,
        prescrizioni o trattamenti medico-veterinari e non sostituisce il medico veterinario. In
        presenza di un'urgenza o di un problema di salute, rivolgiti sempre al tuo medico
        veterinario di fiducia.
        <br />
        {/* TODO prima della pubblicazione: link reale a privacy policy, cookie policy, termini e condizioni */}
        Informativa privacy · Cookie policy · Termini e condizioni (link da collegare)
      </p>
      <p className="mx-auto mt-3 max-w-6xl text-[0.68rem] text-brown/40">
        {/* TODO prima della pubblicazione: ragione sociale, indirizzo, P.IVA, email ufficiale reali */}
        © PetResona Impronta. Dati aziendali (ragione sociale, indirizzo, P.IVA, email) da inserire
        prima della pubblicazione.
      </p>
    </motion.footer>
  )
}
