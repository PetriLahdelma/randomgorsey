/**
 * HTTPS enforcement utilities
 * Implements security best practices for ensuring secure connections
 */

/**
 * Checks if the current page is loaded over HTTPS
 */
export function isHTTPS(): boolean {
  return window.location.protocol === "https:";
}

/**
 * Redirects to HTTPS if current page is loaded over HTTP
 * Should be called on app initialization
 */
export function enforceHTTPS(): void {
  // Only redirect in production environments
  if (
    process.env.NODE_ENV === "production" &&
    !isHTTPS() &&
    window.location.hostname !== "localhost"
  ) {
    const httpsUrl = window.location.href.replace("http://", "https://");
    window.location.replace(httpsUrl);
  }
}

/**
 * Checks if the current environment should enforce HTTPS
 */
export function shouldEnforceHTTPS(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    window.location.hostname !== "localhost" &&
    !window.location.hostname.includes("127.0.0.1")
  );
}

/**
 * Sets up security-related listeners and checks
 */
export function initializeSecurityMeasures(): void {
  // Enforce HTTPS in production
  if (shouldEnforceHTTPS()) {
    enforceHTTPS();
  }

  // Warn about mixed content in development
  if (process.env.NODE_ENV === "development") {
    window.addEventListener("load", () => {
      if (isHTTPS()) {
        console.log("✅ Running over HTTPS");
      } else {
        console.warn("⚠️ Running over HTTP - ensure HTTPS in production");
      }
    });
  }

  // Add security event listeners
  window.addEventListener("beforeunload", () => {
    // Clear any sensitive data from memory if needed
    // This is a good place to clean up sensitive state
  });
}

/**
 * Content Security Policy helpers for inline scripts
 */
export function createSecureScriptTag(
  content: string,
  nonce?: string
): HTMLScriptElement {
  const script = document.createElement("script");
  script.type = "text/javascript";

  if (nonce) {
    script.nonce = nonce;
  }

  script.textContent = content;
  return script;
}

/**
 * Secure external link handler
 */
export function createSecureExternalLink(url: string): string {
  // Add security attributes for external links
  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }

    return url;
  } catch {
    console.warn("Invalid external URL:", url);
    return "#";
  }
}

/**
 * Checks if an external URL is safe to navigate to
 */
export function isSafeExternalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    // Block known malicious domains (extend this list as needed)
    const blockedDomains = [
      "bit.ly",
      "tinyurl.com",
      // Add more as needed
    ];

    return !blockedDomains.some((domain) =>
      parsedUrl.hostname.includes(domain)
    );
  } catch {
    return false;
  }
}
