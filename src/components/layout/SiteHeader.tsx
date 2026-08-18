import { LiquidMorphFloatingMenu } from "@/components/ui/liquid-morph-floating-menu"
import { WHATSAPP_LINK_GENERAL } from "@/config/contact"

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
      ctaHref={WHATSAPP_LINK_GENERAL}
      logo={
        <>
          Resona<b className="text-copper">Pet</b>
        </>
      }
    />
  )
}
