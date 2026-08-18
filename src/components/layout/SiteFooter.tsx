import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { WHATSAPP_LINK_GENERAL } from "@/config/contact"

const LEGAL_LINKS = [
  { label: "Informativa privacy", href: import.meta.env.VITE_PRIVACY_POLICY_URL?.trim() },
  { label: "Cookie policy", href: import.meta.env.VITE_COOKIE_POLICY_URL?.trim() },
  { label: "Termini e condizioni", href: import.meta.env.VITE_TERMS_URL?.trim() },
].filter((item): item is { label: string; href: string } => Boolean(item.href))

const COMPANY_DETAILS = import.meta.env.VITE_COMPANY_DETAILS?.trim()

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
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-5 text-sm text-brown/90">
        <p className="font-serif text-lg text-ink">
          Resona<b className="text-copper">Pet</b>
        </p>
        <nav aria-label="Link footer" className="flex flex-wrap gap-5">
          <a href="#come-si-svolge" className="transition-colors hover:text-copper">
            Come funziona
          </a>
          <a href="#giorgia" className="transition-colors hover:text-copper">
            Giorgia
          </a>
          <a href="#offerta" className="transition-colors hover:text-copper">
            Offerta
          </a>
          <a href="#faq" className="transition-colors hover:text-copper">
            FAQ
          </a>
          <a href={WHATSAPP_LINK_GENERAL} target="_blank" rel="noreferrer" className="transition-colors hover:text-copper">
            Richiedi l'accesso
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-[length:var(--text-micro)] leading-relaxed text-brown/90">
        ResonaPet è un servizio personale, non veterinario. Non effettua diagnosi, prescrizioni o
        trattamenti medico-veterinari e non sostituisce il medico veterinario. In presenza di
        un'urgenza o di un problema di salute, rivolgiti sempre al tuo medico veterinario di
        fiducia.
      </p>
      {LEGAL_LINKS.length > 0 && (
        <nav aria-label="Informazioni legali" className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-x-5 gap-y-2 text-[length:var(--text-micro)] text-brown/90">
          {LEGAL_LINKS.map((item) => (
            <a key={item.label} href={item.href} className="underline decoration-line underline-offset-4 transition-colors hover:text-copper-text">
              {item.label}
            </a>
          ))}
        </nav>
      )}
      <p className="mx-auto mt-4 max-w-6xl text-[length:var(--text-micro)] text-brown/90">
        © ResonaPet{COMPANY_DETAILS ? ` · ${COMPANY_DETAILS}` : ""}
      </p>
    </motion.footer>
  )
}
