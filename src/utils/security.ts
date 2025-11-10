/**
 * Input sanitization and validation utilities
 * Implements security best practices for user input handling
 */

/**
 * Basic HTML escape to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Sanitize text input by removing dangerous characters
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove or escape potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers like onclick=
    .trim()
    .slice(0, 1000); // Limit length to prevent huge payloads
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

/**
 * Validate name input (only letters, spaces, hyphens, apostrophes)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  return nameRegex.test(name) && name.length >= 1 && name.length <= 100;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
  sanitizedData: ContactFormData;
}

export function validateAndSanitizeContactForm(
  data: ContactFormData
): ValidationResult {
  const errors: { [key: string]: string } = {};
  const sanitizedData: ContactFormData = {
    name: sanitizeText(data.name),
    email: sanitizeText(data.email),
    subject: sanitizeText(data.subject),
    message: sanitizeText(data.message),
  };

  // Validate name
  if (!sanitizedData.name) {
    errors.name = "Name is required";
  } else if (!isValidName(sanitizedData.name)) {
    errors.name = "Name contains invalid characters";
  }

  // Validate email
  if (!sanitizedData.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(sanitizedData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Validate subject
  if (!sanitizedData.subject) {
    errors.subject = "Subject is required";
  } else if (sanitizedData.subject.length > 200) {
    errors.subject = "Subject is too long (max 200 characters)";
  }

  // Validate message
  if (!sanitizedData.message) {
    errors.message = "Message is required";
  } else if (sanitizedData.message.length < 10) {
    errors.message = "Message is too short (minimum 10 characters)";
  } else if (sanitizedData.message.length > 5000) {
    errors.message = "Message is too long (max 5000 characters)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> =
    new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60 * 1000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }

  getResetTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return 0;
    }
    return record.resetTime;
  }
}

/**
 * Content Security Policy helpers
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;
