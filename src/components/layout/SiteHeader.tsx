import { LiquidMorphFloatingMenu } from "@/components/ui/liquid-morph-floating-menu"

const LINKS = [
  { label: "Come funziona", href: "#come-si-svolge" },
  { label: "Cosa ricevi", href: "#cosa-ricevi" },
  { label: "Giorgia", href: "#giorgia" },
  { label: "FAQ", href: "#faq" },
]

export function SiteHeader() {
  return (
    <LiquidMorphFloatingMenu
      links={LINKS}
      ctaLabel="Richiedi accesso"
      ctaHref="/richiedi-accesso.html"
      logo={
        <>
          Pet<b className="text-copper">Resona</b>
        </>
      }
    />
  )
}
