"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import CookieConsent from "@/components/CookieConsent";
import { AnimationProvider } from "@/lib/motion/AnimationProvider";
import { TransitionContext } from "@/lib/transition/TransitionContext";
import Header from "@/patterns/Header";

const AppShellContext = React.createContext<{ setOverlayActive: (active: boolean) => void }>({ setOverlayActive: () => {} });
export function useAppShell() { return React.useContext(AppShellContext); }

export default function AppShell({ children, footer, version }: { children: React.ReactNode; footer?: React.ReactNode; version: string }) {
  const [isOverlayActive, setOverlayActive] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const navigate = useCallback((href: string) => router.push(href), [router]);
  const transition = useMemo(() => ({ navigate, isTransitioning: false }), [navigate]);
  const overlay = useMemo(() => ({ setOverlayActive }), []);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (window.location.hash) return;
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <AnimationProvider>
      <TransitionContext.Provider value={transition}>
        <AppShellContext.Provider value={overlay}>
          <a href="#main-content" className="studioSkip">Skip to content</a>
          <Header version={version} />
          <main id="main-content" tabIndex={-1}>{children}</main>
          {!isOverlayActive && footer}
          <CookieConsent />
        </AppShellContext.Provider>
      </TransitionContext.Provider>
    </AnimationProvider>
  );
}
