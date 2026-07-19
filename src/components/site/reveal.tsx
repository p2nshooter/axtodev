"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered reveal, safe by default: content is visible in the
 * server-rendered HTML (so it's never gated behind JS for SEO crawlers,
 * no-JS clients, or a race condition where the observer never fires — a
 * fullPage screenshot once exposed exactly this: content stayed
 * permanently invisible because a headless-browser resize doesn't always
 * dispatch the events IntersectionObserver relies on).
 *
 * Only once JS has mounted AND confirmed the element starts below the
 * fold do we hide it and animate it in on scroll; anything already
 * on-screen, or if JS never takes over, just renders normally.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false); // JS took over and element starts off-screen
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.92;
    if (alreadyInView) return; // leave it visible as rendered, no animation needed

    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    // Safety net: never leave content hidden indefinitely if the observer
    // misbehaves in some environment.
    const fallback = setTimeout(() => setVisible(true), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={armed ? { transitionDelay: visible ? `${delayMs}ms` : "0ms" } : undefined}
      className={cn(
        armed && "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        armed && (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
        className,
      )}
    >
      {children}
    </div>
  );
}
