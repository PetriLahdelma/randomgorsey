"use client";

import React from "react";

import CookieConsent from "@/components/CookieConsent";

import { AnimationProvider } from "@/lib/motion";
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

  React.useEffect(() => {
    initializeSecurityMeasures();
  }, []);

  const value = React.useMemo(
    () => ({ setOverlayActive }),
    []
  );

  return (
    <AnimationProvider>
        <AppShellContext.Provider value={value}>
          <div className={cn("flex min-h-screen flex-col text-center")}>
            <Header />
            {children}
            {!isOverlayActive && <Footer />}
            <CookieConsent />
          </div>
        </AppShellContext.Provider>
    </AnimationProvider>
  );
}
