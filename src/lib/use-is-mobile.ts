import { useEffect, useState } from "react"

const QUERY = "(max-width: 767px)"

/** Mirrors the site's md: breakpoint (768px) so JS-driven behavior can match
 * the same cutoff as the Tailwind responsive classes. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
