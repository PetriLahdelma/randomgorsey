/**
 * Custom Scroll Hooks
 *
 * Provides scroll utilities that integrate with Lenis smooth scroll
 * while providing native fallbacks.
 */

import { useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LenisContext } from 'lenis/react';

/**
 * Safely get Lenis instance - returns null if no provider exists.
 * This is necessary because useLenis() throws when called outside ReactLenis.
 */
function useLenisSafe() {
  const context = useContext(LenisContext);
  return context?.lenis ?? null;
}

/**
 * Scrolls to top of page when route changes.
 * Works with both Lenis (if active) and native scroll.
 *
 * Must be called within a component inside BrowserRouter.
 */
export function useScrollToTopOnRouteChange(): void {
  const lenis = useLenisSafe();
  const location = useLocation();

  useEffect(() => {
    // Immediate scroll to prevent seeing previous position
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, lenis]);
}

interface ScrollToOptions {
  /** Scroll duration in seconds (ignored if immediate=true). Default: 1.2 */
  duration?: number;
  /** Skip animation and jump immediately. Default: false */
  immediate?: boolean;
  /** Offset from target in pixels. Default: 0 */
  offset?: number;
}

/**
 * Returns a function to programmatically scroll via Lenis or native fallback.
 *
 * @example
 * ```tsx
 * const scrollTo = useLenisScrollTo();
 *
 * // Scroll to top
 * scrollTo(0);
 *
 * // Scroll to element
 * scrollTo('#section-id', { duration: 1.5 });
 *
 * // Scroll to position with offset
 * scrollTo(500, { offset: -100 });
 * ```
 */
export function useLenisScrollTo() {
  const lenis = useLenisSafe();

  const scrollTo = useCallback(
    (target: number | string, options: ScrollToOptions = {}) => {
      const { duration = 1.2, immediate = false, offset = 0 } = options;

      if (lenis) {
        lenis.scrollTo(target, { duration, immediate, offset });
      } else {
        // Native fallback
        if (typeof target === 'number') {
          window.scrollTo({
            top: target + offset,
            behavior: immediate ? 'auto' : 'smooth',
          });
        } else {
          // Target is a selector
          const element = document.querySelector(target);
          if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({
              top,
              behavior: immediate ? 'auto' : 'smooth',
            });
          }
        }
      }
    },
    [lenis]
  );

  return scrollTo;
}
