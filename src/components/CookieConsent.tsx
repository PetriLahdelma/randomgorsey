import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import styles from "./CookieConsent.module.css";

const COOKIE_NAME = "cookieConsent";
export const COOKIE_PREFERENCES_EVENT = "random-gorsey-cookie-preferences";

type ConsentChoice = "all" | "necessary" | null;

const getCookie = (): string | null => {
  const match = document.cookie.match(
    new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)")
  );
  return match ? match[2] : null;
};

const setCookie = (value: string) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${
    60 * 60 * 24 * 365
  }; SameSite=Lax${secure}`;
};

const updateAnalyticsConsent = (granted: boolean) => {
  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  if (!trackingId) return;

  const analyticsWindow = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    [key: string]: unknown;
  };
  analyticsWindow[`ga-disable-${trackingId}`] = !granted;
  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
};

const loadGoogleAnalytics = () => {
  const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  if (!gaTrackingId) {
    // Only show warning in production or when explicitly set
    if (process.env.NODE_ENV === "production") {
      console.warn("Google Analytics tracking ID not configured");
    }
    return;
  }

  updateAnalyticsConsent(true);
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
  script.id = "ga-script";
  document.head.appendChild(script);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaTrackingId}');
  `;
  document.head.appendChild(script2);
};

export interface CookieConsentProps {
  className?: string;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const consent = getCookie() as ConsentChoice;
      setCurrentChoice(consent);
      setOpen(consent === null);
      if (consent === "all") {
        loadGoogleAnalytics();
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleOpenPreferences = () => {
      setCurrentChoice(getCookie() as ConsentChoice);
      setOpen(true);
    };
    window.addEventListener(COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, handleOpenPreferences);
    };
  }, []);

  const acceptAll = () => {
    setCookie("all");
    setCurrentChoice("all");
    loadGoogleAnalytics();
    setOpen(false);
  };

  const acceptNecessary = () => {
    setCookie("necessary");
    setCurrentChoice("necessary");
    updateAnalyticsConsent(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <aside
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className={cn(styles.panel, className)}
    >
        <div className={styles.titleBar}>
          <h2 id="cookie-consent-title" className={styles.title}>
            Cookie preferences
          </h2>
        </div>
        <div id="cookie-consent-description" className={styles.content}>
          <p>
            Necessary cookies remember your choice. Analytics stays off unless
            you accept all cookies.
          </p>
          <p className={styles.currentChoice} aria-live="polite">
            Current choice: {currentChoice === "all"
              ? "All cookies"
              : currentChoice === "necessary"
                ? "Necessary only"
                : "Not set"}
          </p>
        </div>
        <div className={styles.actions}>
          <Button
            variant="secondary-dark"
            onClick={acceptNecessary}
            aria-label="Accept only necessary cookies"
            aria-pressed={currentChoice === "necessary"}
          >
            Necessary
          </Button>
          <Button
            onClick={acceptAll}
            aria-label="Accept all cookies (including analytics)"
            aria-pressed={currentChoice === "all"}
          >
            Accept all
          </Button>
        </div>
    </aside>
  );
};

export default CookieConsent;
