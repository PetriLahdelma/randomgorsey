"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePerformance } from "@/lib/performance";
import { getSignalBus } from "@/lib/signal";
import { tearExit, tearEnter } from "./DOMTear";
import { TransitionContext } from "./TransitionContext";

interface TransitionOrchestratorProps {
  children: React.ReactNode;
  contentRef: React.RefObject<HTMLElement | null>;
}

/**
 * Five-phase transition sequence (~600ms total):
 * 1. Destabilize (0-120ms): noise overlay ramps, shader turbulence spikes
 * 2. Tear (120-220ms): DOM bands slide offscreen
 * 3. Raw Signal (220-340ms): shader at full intensity, no content visible
 * 4. Assemble (340-480ms): new content slides in from alternating directions
 * 5. Lock (480-600ms): content snaps to final position, shader calms
 *
 * Degradation:
 * - Tier 3: Full 5-phase sequence
 * - Tier 2: Opacity crossfade + shader spike (no DOM tear)
 * - Tier 1: Simple 200ms crossfade
 * - Tier 0: Instant cut
 */
export function TransitionOrchestrator({
  children,
  contentRef,
}: TransitionOrchestratorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { tier, isReducedMotion } = usePerformance();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bus = getSignalBus();
  const transitionRef = useRef(false);

  const announceRef = useRef<HTMLDivElement>(null);
  const announce = useCallback((pageName: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = `Navigating to ${pageName}`;
    }
  }, []);

  // Condensed transition for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      if (tier <= 1 || isReducedMotion) return;

      setIsTransitioning(true);
      transitionRef.current = true;

      // Raw signal flash
      bus.setTransition(0.8);
      setTimeout(() => {
        bus.setTransition(0.4);
        // Assemble
        const content = contentRef.current;
        if (content && tier >= 3) {
          tearEnter(content, { duration: 100, stagger: 12, bandCount: 6 });
        }
        setTimeout(() => {
          bus.setTransition(0);
          transitionRef.current = false;
          setIsTransitioning(false);
        }, 180);
      }, 120);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tier, isReducedMotion, bus, contentRef]);

  const navigate = useCallback(
    async (href: string) => {
      if (href === pathname) return;
      if (transitionRef.current) return;
      transitionRef.current = true;
      setIsTransitioning(true);

      const pageName = href === "/" ? "home" : href.replace("/", "");
      announce(pageName);

      // Tier 0 or reduced motion: instant navigation
      if (tier === 0 || isReducedMotion) {
        router.push(href);
        transitionRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Tier 1: simple crossfade
      if (tier === 1) {
        const content = contentRef.current;
        if (content) {
          content.style.transition = "opacity 200ms ease-out";
          content.style.opacity = "0";
          await new Promise((r) => setTimeout(r, 200));
        }
        router.push(href);
        requestAnimationFrame(() => {
          if (content) {
            content.style.opacity = "1";
          }
          transitionRef.current = false;
          setIsTransitioning(false);
        });
        return;
      }

      // Tier 2: opacity crossfade + shader spike (no DOM tear)
      if (tier === 2) {
        const content = contentRef.current;
        bus.setTransition(0.8);
        if (content) {
          content.style.transition = "opacity 150ms ease-out";
          content.style.opacity = "0";
        }
        await new Promise((r) => setTimeout(r, 200));
        router.push(href);
        await new Promise((r) => setTimeout(r, 100));
        if (content) {
          content.style.transition = "opacity 200ms ease-out";
          content.style.opacity = "1";
        }
        const fadeSteps = 10;
        for (let i = fadeSteps; i >= 0; i--) {
          bus.setTransition((i / fadeSteps) * 0.8);
          await new Promise((r) => setTimeout(r, 30));
        }
        transitionRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Tier 3: Full 5-phase sequence
      const content = contentRef.current;

      // Phase 1: Destabilize (0-120ms)
      bus.setTransition(0.3);
      if (content) {
        content.style.transition = "none";
        content.classList.add("signal-destabilize");
      }
      await new Promise((r) => setTimeout(r, 120));

      // Phase 2: Tear (120-220ms)
      bus.setTransition(0.7);
      if (content) {
        await tearExit(content, { duration: 80, stagger: 12, bandCount: 8 });
      }

      // Phase 3: Raw Signal (220-340ms)
      bus.setTransition(1.0);
      if (content) {
        content.style.opacity = "0";
        content.classList.remove("signal-destabilize");
      }
      router.push(href);
      const rawSignalStart = performance.now();
      await new Promise((r) => setTimeout(r, 120));
      const waitForMount = () =>
        new Promise<void>((r) => {
          const check = () => {
            const elapsed = performance.now() - rawSignalStart;
            if (elapsed > 320 || (content && content.children.length > 0)) {
              r();
            } else {
              setTimeout(check, 16);
            }
          };
          check();
        });
      await waitForMount();

      // Phase 4: Assemble (340-480ms)
      bus.setTransition(0.6);
      if (content) {
        content.style.opacity = "1";
        await tearEnter(content, { duration: 120, stagger: 18, bandCount: 8 });
      }

      // Phase 5: Lock (480-600ms)
      if (content) {
        content.style.transform = "translateX(1px)";
        await new Promise((r) => setTimeout(r, 16));
        content.style.transform = "";
      }
      const fadeSteps = 8;
      for (let i = fadeSteps; i >= 0; i--) {
        bus.setTransition((i / fadeSteps) * 0.3);
        await new Promise((r) => setTimeout(r, 15));
      }
      bus.setTransition(0);

      transitionRef.current = false;
      setIsTransitioning(false);
    },
    [pathname, tier, isReducedMotion, router, bus, contentRef, announce]
  );

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        className="sr-only"
      />
      {children}
    </TransitionContext.Provider>
  );
}
