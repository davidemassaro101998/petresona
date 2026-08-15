"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useWillChange,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface RevealImageMaskProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  title?: string;
  caption?: string;
  shape?: "circle" | "rounded";
  maskOrigin?: string;
}

export const RevealImageMask = React.forwardRef<HTMLDivElement, RevealImageMaskProps>(
  function RevealImageMask(
    {
      className,
      src = "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
      alt = "Warm light pouring into a modern interior.",
      title,
      caption,
      shape = "circle",
      maskOrigin = "50% 50%",
      ...props
    },
    ref,
  ) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const willChange = useWillChange();
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 85%", "end 15%"],
    });
    const progress = useSpring(scrollYProgress, {
      stiffness: 170,
      damping: 24,
      mass: 0.95,
    });
    const radius = useTransform(progress, [0, 1], shape === "circle" ? ["16%", "75%"] : ["10%", "0%"]);
    const inset = useTransform(progress, [0, 1], ["30%", "0%"]);
    const circleClipPath = useTransform(radius, (latest) => `circle(${latest} at ${maskOrigin})`);
    const roundedClipPath = useTransform(
      [radius, inset],
      ([latestRadius, latestInset]) => `inset(${latestInset} round ${latestRadius})`,
    );

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "rounded-[2.5rem] bg-[color:var(--color-surface)] p-4 md:p-6",
          className,
        )}
        {...props}
      >
        {(title || caption) && (
          <div className="mb-6 space-y-3 px-2">
            {title && (
              <h3 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-foreground md:text-5xl">
                {title}
              </h3>
            )}
            {caption && <p className="max-w-2xl text-sm leading-7 text-foreground/65">{caption}</p>}
          </div>
        )}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  clipPath: shape === "circle" ? circleClipPath : roundedClipPath,
                  willChange,
                }
          }
          className="aspect-[16/10] overflow-hidden rounded-[2rem]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the scroll-linked clip-path mask needs a plain img, not next/image's wrapper */}
          <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </motion.div>
      </div>
    );
  },
);
