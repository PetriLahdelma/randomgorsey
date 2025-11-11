import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "./CookieConsent.module.css";

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

  const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;
  if (!gaTrackingId) {
    // Only show warning in production or when explicitly set
    if (process.env.NODE_ENV === "production") {
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

const CookieConsent: React.FC = () => {
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
      <div className={styles.content}>
        <h2>Cookie Notice</h2>
        <p>
          <strong>We use cookies</strong> to remember your preferences and to
          analyze how visitors interact with our site.
        </p>
        <p>
          Accepting all cookies allows us to use Google Analytics for
          statistics. You can also choose to keep only the cookies necessary for
          the website to function.
        </p>
        <div className={styles.actions}>
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
