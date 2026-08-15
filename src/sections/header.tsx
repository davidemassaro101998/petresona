"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV = [
  { href: "#come-funziona", label: "Come funziona" },
  { href: "#percorso", label: "Il percorso" },
  { href: "#giorgia", label: "Giorgia" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className={`font-serif text-xl ${scrolled ? "text-primary" : "text-primary-foreground [text-shadow:0_1px_10px_rgb(0_0_0_/_35%)]"}`}
        >
          Pet<span className="text-[color:var(--color-accent-copper)] font-semibold">Resona</span>
        </Link>

        <nav
          className={`hidden items-center gap-7 text-sm md:flex ${
            scrolled ? "text-primary/80" : "text-primary-foreground/90 [text-shadow:0_1px_8px_rgb(0_0_0_/_35%)]"
          }`}
        >
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[color:var(--color-accent-copper)]">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#calendario"
          className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors md:inline-flex ${
            scrolled
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          }`}
        >
          Verifica e prenota
        </a>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span
            className={`h-px w-6 transition-transform ${scrolled ? "bg-primary" : "bg-primary-foreground"} ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 transition-opacity ${scrolled ? "bg-primary" : "bg-primary-foreground"} ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-px w-6 transition-transform ${scrolled ? "bg-primary" : "bg-primary-foreground"} ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-border bg-background px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-base text-primary">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#calendario"
                onClick={() => setMenuOpen(false)}
                className="mt-1 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Verifica e prenota
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
