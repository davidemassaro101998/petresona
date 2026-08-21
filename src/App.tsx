import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { MobileCta } from "@/components/layout/MobileCta"
import { HeroTransition } from "@/components/sections/HeroTransition"
import { TimelineSection } from "@/components/sections/TimelineSection"
import { GiorgiaSection } from "@/components/sections/GiorgiaSection"
import { VeterinariaSection } from "@/components/sections/VeterinariaSection"
import { OffertaSection } from "@/components/sections/OffertaSection"
import { FaqSection } from "@/components/sections/FaqSection"
import { FrequenzaClosingSection } from "@/components/sections/FrequenzaClosingSection"

function App() {
  return (
    <>
      <a className="skip-link" href="#contenuto">
        Salta al contenuto
      </a>
      <SiteHeader />
      <main id="contenuto">
        <div id="top" />
        <HeroTransition />
        <TimelineSection />
        <GiorgiaSection />
        <VeterinariaSection />
        <OffertaSection />
        <FaqSection />
        <FrequenzaClosingSection />
      </main>
      <SiteFooter />
      <MobileCta />
    </>
  )
}

export default App
