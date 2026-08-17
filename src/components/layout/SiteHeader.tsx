import { LiquidMorphFloatingMenu } from "@/components/ui/liquid-morph-floating-menu"

const LINKS = [
  { label: "Come funziona", href: "#come-si-svolge" },
  { label: "Giorgia", href: "#giorgia" },
  { label: "Offerta", href: "#offerta" },
  { label: "FAQ", href: "#faq" },
]

export function SiteHeader() {
  return (
    <LiquidMorphFloatingMenu
      links={LINKS}
      ctaLabel="Richiedi l'accesso"
      ctaHref="/richiedi-accesso.html"
      logo={
        <>
          Resona<b className="text-copper">Pet</b>
        </>
      }
    />
  )
}
