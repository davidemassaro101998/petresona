import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { MobileCta } from "@/components/layout/MobileCta"
import { HeroImprintTransition } from "@/components/sections/HeroImprintTransition"
import { CosaRiceviSection } from "@/components/sections/CosaRiceviSection"
import { TimelineSection } from "@/components/sections/TimelineSection"
import { GiorgiaSection } from "@/components/sections/GiorgiaSection"
import { OffertaSection } from "@/components/sections/OffertaSection"
import { FaqSection } from "@/components/sections/FaqSection"

function App() {
  return (
    <>
      <a className="skip-link" href="#contenuto">
        Salta al contenuto
      </a>
      <SiteHeader />
      <main id="contenuto">
        <div id="top" />
        <HeroImprintTransition />
        <CosaRiceviSection />
        <TimelineSection />
        <GiorgiaSection />
        <OffertaSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <MobileCta />
    </>
  )
}

export default App
