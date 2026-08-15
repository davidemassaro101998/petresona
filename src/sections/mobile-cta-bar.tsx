"use client";

import { useEffect, useState } from "react";

export function MobileCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-root");
    const onScroll = () => {
      const heroHeight = hero?.offsetHeight ?? window.innerHeight;
      setShow(window.scrollY > heroHeight * 0.25);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href="#calendario"
        className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground"
      >
        Verifica e prenota
      </a>
    </div>
  );
}
