import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Modal from "./Modal";
import Button from "./Button";

const COOKIE_NAME = "cookieConsent";

const getCookie = (): string | null => {
  const match = document.cookie.match(
    new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)")
  );
  return match ? match[2] : null;
};

const setCookie = (value: string) => {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${
    60 * 60 * 24 * 365
  }`;
};

const loadGoogleAnalytics = () => {
  if (document.getElementById("ga-script")) return;

  const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;
  if (!gaTrackingId) {
    // Only show warning in production or when explicitly set
    if (import.meta.env.PROD) {
      console.warn("Google Analytics tracking ID not configured");
    }
    return;
  }

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

  useEffect(() => {
    const consent = getCookie();
    if (!consent) {
      setOpen(true);
    } else if (consent === "all") {
      loadGoogleAnalytics();
    }
  }, []);

  const acceptAll = () => {
    setCookie("all");
    loadGoogleAnalytics();
    setOpen(false);
  };

  const acceptNecessary = () => {
    setCookie("necessary");
    setOpen(false);
  };

  return (
    <Modal isOpen={open} onClose={acceptNecessary}>
      <div
        className={cn(
          "max-w-[50rem] font-['Europa_Regular',sans-serif] text-center",
          "max-xl:max-w-[80%] max-xl:mx-8",
          className
        )}
      >
        <h2 className="mb-8 font-['Tschick_Bold',sans-serif] text-[#f0f] uppercase">
          Cookie Notice
        </h2>
        <p className="mb-8 leading-[1.3] text-[#00f]">
          <strong>We use cookies</strong> to remember your preferences and to
          analyze how visitors interact with our site.
        </p>
        <p className="mb-8 leading-[1.3] text-[#00f]">
          Accepting all cookies allows us to use Google Analytics for
          statistics. You can also choose to keep only the cookies necessary for
          the website to function.
        </p>
        <div
          className={cn(
            "flex gap-4 justify-end mt-4",
            "max-xl:flex-col max-xl:items-center"
          )}
        >
          <Button
            variant="secondary"
            onClick={acceptNecessary}
            aria-label="Accept only necessary cookies"
          >
            Necessary
          </Button>
          <Button
            onClick={acceptAll}
            aria-label="Accept all cookies (including analytics)"
          >
            Accept all
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CookieConsent;
