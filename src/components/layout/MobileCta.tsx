import { useEffect, useState } from "react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { track } from "@/lib/analytics"

export function MobileCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const receive = document.getElementById("come-si-svolge")
    const finalCta = document.getElementById("faq-closing-cta")
    if (!receive) return

    let pastReceive = false
    let finalVisible = false
    let menuOpen = false

    const update = () => setShow(pastReceive && !finalVisible && !menuOpen)

    const ioReceive = new IntersectionObserver(
      ([entry]) => {
        pastReceive = entry.boundingClientRect.top < 0
        update()
      },
      { threshold: 0 }
    )
    ioReceive.observe(receive)

    let ioFinal: IntersectionObserver | undefined
    if (finalCta) {
      ioFinal = new IntersectionObserver(
        ([entry]) => {
          finalVisible = entry.isIntersecting
          update()
        },
        { threshold: 0.2 }
      )
      ioFinal.observe(finalCta)
    }

    const onBodyChange = () => {
      menuOpen = document.body.classList.contains("overflow-hidden")
      update()
    }
    const bodyObserver = new MutationObserver(onBodyChange)
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] })

    return () => {
      ioReceive.disconnect()
      ioFinal?.disconnect()
      bodyObserver.disconnect()
    }
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ background: "color-mix(in oklab, var(--color-ivory) 97%, transparent)", borderTop: "1px solid var(--color-line)" }}
    >
      <InteractiveHoverButton
        href="/richiedi-accesso.html"
        onClick={() => track("access_cta_click")}
        className="flex w-full"
      >
        Richiedi l'accesso
      </InteractiveHoverButton>
    </div>
  )
}
