"use client";

import React from "react";

import CookieConsent from "@/components/CookieConsent";

import { AnimationProvider } from "@/lib/motion";
import { TransitionOrchestrator } from "@/lib/transition";
import { cn } from "@/lib/utils";
import Footer from "@/patterns/Footer";
import Header from "@/patterns/Header";
import { initializeSecurityMeasures } from "@/utils/httpsEnforcement";

interface AppShellContextValue {
  setOverlayActive: (active: boolean) => void;
}

const AppShellContext = React.createContext<AppShellContextValue>({
  setOverlayActive: () => {},
});

export function useAppShell() {
  return React.useContext(AppShellContext);
}

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isOverlayActive, setOverlayActive] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    initializeSecurityMeasures();
  }, []);

  const value = React.useMemo(
    () => ({ setOverlayActive }),
    []
  );

  return (
    <AnimationProvider>
      <TransitionOrchestrator contentRef={contentRef}>
        <AppShellContext.Provider value={value}>
          <div
            ref={contentRef}
            className={cn("flex min-h-screen flex-col text-center", "relative z-10")}
          >
            <Header />
            <main className="pt-16">{children}</main>
            {!isOverlayActive && <Footer />}
            <CookieConsent />
          </div>
        </AppShellContext.Provider>
      </TransitionOrchestrator>
    </AnimationProvider>
  );
}
