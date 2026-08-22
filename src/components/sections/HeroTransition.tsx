import { HeroSection } from "@/components/sections/HeroSection"
import { SistemaSection } from "@/components/sections/SistemaSection"

// Hero plays its own settle-in animation once on mount and the page scrolls
// normally from there — no pinned/scroll-hijacked stage.
export function HeroTransition() {
  return (
    <>
      <HeroSection />
      <SistemaSection />
    </>
  )
}
