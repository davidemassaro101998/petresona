/**
 * Source: https://21st.dev/@aayush-duhan/components/liquid-morph-floating-menu
 * Retrieved from the authenticated 21st.dev Source > Component.tsx tab
 * (the earlier `curl` 403 was the unauthenticated HTTP route — see
 * 21ST_SOURCES.md for the full history of this component).
 *
 * Kept from the real source:
 * - `ease = [0.22, 1, 0.36, 1]` (identical constant).
 * - The container's width/height/borderRadius morph between a closed pill
 *   and an open panel (the original animates 150x48 -> 280x260; here the
 *   header capsule morphs instead between a transparent bar and an ivory
 *   pill, and the mobile panel morphs between the closed hamburger button
 *   and the open panel).
 * - The "color layer expands from within" idea: the original grows a dark
 *   circle from the bottom to reveal the open state; ResonaPet's mobile
 *   panel expands a copper circle from the trigger instead.
 * - `MenuButton`'s per-character split-flap "roll" (two stacked copies of
 *   each character, `translateY(-50%)` on hover, staggered `30ms * index`)
 *   — reused verbatim as `<LetterRoll>` for the desktop nav links.
 * - The item stagger delay formula `0.4 + 0.08 * index` and the
 *   opacity-only entrance for menu items.
 * - Close on outside click via a `mousedown` document listener.
 *
 * Removed/adapted (brief section 7 + corrective instructions):
 * - `fixed bottom-10 left-1/2` floating-pill positioning -> integrated
 *   into `<header>`, fixed to the top.
 * - The desktop nav is not a collapse-to-open pill (the brief wants links
 *   always visible on desktop, capsule only on scroll) — the morph
 *   container is used for two things instead: (a) the header capsule
 *   itself (transparent -> ivory after 40px scroll) and (b) the mobile
 *   panel (closed hamburger -> open sheet).
 * - Yellow `#FFE862` / dark `#242424` demo colors -> ResonaPet ivory /
 *   copper / ink palette.
 * - "Home / Works / Contact" placeholder items -> real section anchors.
 * - Added: `aria-expanded`, `aria-controls`, `aria-label`, Escape-to-close
 *   with focus return, scroll lock only while the mobile panel is open,
 *   and disabling the letter-roll on touch devices and under
 *   `prefers-reduced-motion` (the original has neither).
 */
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const ease = [0.22, 1, 0.36, 1] as const

export interface NavLink {
  label: string
  href: string
}

function useIsTouch() {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches)
  }, [])
  return touch
}

/** Per-character split-flap roll, straight from the original MenuButton. */
function LetterRoll({ label, active }: { label: string; active: boolean }) {
  const chars = label.split("")
  return (
    <span className="relative block overflow-hidden" style={{ height: "1em" }}>
      <span className="flex">
        {chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden" style={{ height: "1em" }}>
            <span
              className="flex flex-col"
              style={{
                transitionProperty: "transform",
                transitionDuration: active ? "800ms" : "0ms",
                transitionDelay: active ? `${30 * i}ms` : "0ms",
                transform: active ? "translateY(-50%)" : "translateY(0%)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <span className="block" style={{ height: "1em", lineHeight: "1em" }}>
                {char === " " ? " " : char}
              </span>
              <span className="block" style={{ height: "1em", lineHeight: "1em" }} aria-hidden>
                {char === " " ? " " : char}
              </span>
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}

function DesktopLink({ link, dark, isActive }: { link: NavLink; dark: boolean; isActive: boolean }) {
  const [hovered, setHovered] = useState(false)
  const isTouch = useIsTouch()
  const prefersReducedMotion = useReducedMotion()
  const rollEnabled = !isTouch && !prefersReducedMotion

  return (
    <a
      href={link.href}
      onMouseEnter={() => rollEnabled && setHovered(true)}
      onMouseLeave={() => rollEnabled && setHovered(false)}
      aria-current={isActive ? "true" : undefined}
      className={`relative py-1 text-sm transition-colors ${
        isActive
          ? dark
            ? "text-copper"
            : "text-copper-light"
          : dark
            ? "text-ink/85 hover:text-copper"
            : "text-ivory/90 hover:text-copper-light"
      }`}
    >
      {rollEnabled ? <LetterRoll label={link.label} active={hovered} /> : link.label}
      {isActive && (
        <motion.span
          layoutId="nav-active-underline"
          className={`absolute -bottom-1 left-0 right-0 h-[1.5px] ${dark ? "bg-copper" : "bg-copper-light"}`}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
    </a>
  )
}

export function LiquidMorphFloatingMenu({
  links,
  ctaLabel,
  ctaHref,
  logo,
}: {
  links: NavLink[]
  ctaLabel: string
  ctaHref: string
  logo: React.ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scrollspy: highlights the nav link for the section currently under the
  // header, tracked independently per link so order in `links` decides the
  // tie-break when more than one section is technically in range.
  useEffect(() => {
    const anchorHrefs = links.filter((l) => l.href.startsWith("#")).map((l) => l.href)
    const targets = anchorHrefs
      .map((href) => ({ href, el: document.querySelector(href) }))
      .filter((t): t is { href: string; el: Element } => Boolean(t.el))
    if (!targets.length) return

    const intersecting = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = targets.find((t) => t.el === entry.target)?.href
          if (href) intersecting.set(href, entry.isIntersecting)
        }
        const current = anchorHrefs.filter((href) => intersecting.get(href))
        if (current.length) setActiveHref(current[current.length - 1])
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 }
    )
    targets.forEach((t) => observer.observe(t.el))
    return () => observer.disconnect()
  }, [links])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClickOutside)
    document.body.classList.add("overflow-hidden")
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClickOutside)
      document.body.classList.remove("overflow-hidden")
    }
  }, [open])

  // the mobile panel behind the header is always a light "paper" surface, so
  // once it's open the header must read as its dark-on-light variant even
  // if the page itself hasn't scrolled past 40px yet
  const dark = scrolled || open

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <motion.div
          layout
          transition={{ duration: 0.5, ease }}
          className={`flex w-full items-center justify-between gap-6 px-5 py-3 transition-colors ${
            scrolled
              ? "max-w-3xl rounded-full border border-copper/25 bg-ivory/95 shadow-[0_10px_30px_-15px_rgba(59,42,34,0.35)] md:bg-ivory/90 md:backdrop-blur-md"
              : "max-w-6xl rounded-full border border-transparent bg-transparent"
          }`}
        >
          <a href="#top" className={`font-serif text-lg shrink-0 transition-colors ${dark ? "text-ink" : "text-ivory"}`}>
            {logo}
          </a>
          <nav aria-label="Navigazione principale" className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <DesktopLink key={link.href} link={link} dark={dark} isActive={link.href === activeHref} />
            ))}
          </nav>
          <a
            href={ctaHref}
            className="hidden shrink-0 items-center justify-center rounded-full bg-copper px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-brown md:inline-flex"
          >
            {ctaLabel}
          </a>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`h-[1.5px] w-5 transition-transform ${dark ? "bg-ink" : "bg-ivory"} ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 transition-opacity ${dark ? "bg-ink" : "bg-ivory"} ${open ? "opacity-0" : ""}`} />
            <span className={`h-[1.5px] w-5 transition-transform ${dark ? "bg-ink" : "bg-ivory"} ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </motion.div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            ref={panelRef}
            id="mobile-menu-panel"
            aria-label="Navigazione mobile"
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.35 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease }}
            style={{ transformOrigin: "calc(100% - 40px) 40px" }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-paper px-8 py-24 md:hidden"
          >
            <ul className="grid gap-6 font-serif text-2xl text-ink">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.4 + 0.08 * i, ease }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={link.href === activeHref ? "true" : undefined}
                    className={link.href === activeHref ? "text-copper" : undefined}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href={ctaHref}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.4 + 0.08 * links.length, ease }}
              className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-copper px-6 py-3 text-sm font-semibold text-ivory"
            >
              {ctaLabel}
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
