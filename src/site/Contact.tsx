"use client";

import emailjs from "@emailjs/browser";
import React, { useEffect, useRef, useState } from "react";

import { StudioWindow } from "@/components/studio/StudioWindow";
import { RateLimiter, sanitizeText } from "@/utils/security";
import {
  ContactReason,
  contactSchemaByReason,
} from "@/utils/validation";

import styles from "./Contact.module.css";

type FormErrors = Record<string, string>;

interface ReasonOption {
  key: ContactReason;
  index: string;
  title: string;
  subtitle: string;
}

const REASONS: ReasonOption[] = [
  { key: "booking", index: "01", title: "Booking & Events", subtitle: "Gigs, festivals, DJ sets" },
  { key: "collaboration", index: "02", title: "Collaboration", subtitle: "Remixes, tracks, projects" },
  { key: "hello", index: "03", title: "Just saying hello", subtitle: "Fan mail, questions, whatever" },
];

const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under €500" },
  { value: "500-1000", label: "€500–€1,000" },
  { value: "1000-2500", label: "€1,000–€2,500" },
  { value: "2500-plus", label: "€2,500+" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

const PROJECT_TYPE_OPTIONS = [
  { value: "remix", label: "Remix" },
  { value: "track", label: "Track" },
  { value: "other", label: "Other" },
] as const;

function buildEmailMessage(fields: Record<string, string | undefined>): string {
  return Object.entries(fields)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase());
      return `${label}: ${value}`;
    })
    .join("\n");
}

function clearFieldError(errors: FormErrors, field: string): FormErrors {
  const next = { ...errors };
  delete next[field];
  delete next.general;
  return next;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}

function Field({ id, label, error, children, optional = false }: FieldProps) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldHeading}>
        <label htmlFor={id}>{label}</label>
        {optional && <span>Optional</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<ContactReason | null>(null);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [projectType, setProjectType] = useState("");
  const [timeline, setTimeline] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const firstReasonRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);
  const rateLimiterRef = useRef(new RateLimiter(5, 60 * 1000));

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) emailjs.init(publicKey);
  }, []);

  const clearReasonFields = () => {
    setMessage("");
    setDate("");
    setVenue("");
    setLocation("");
    setBudget("");
    setProjectType("");
    setTimeline("");
    setFormErrors({});
  };

  const chooseReason = (nextReason: ContactReason) => {
    if (reason !== nextReason) clearReasonFields();
    setReason(nextReason);
    setSuccess(false);
  };

  const resetReason = () => {
    clearReasonFields();
    setReason(null);
  };

  const updateField = (
    field: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setFormErrors((current) => clearFieldError(current, field));
  };

  const buildFormData = (): Record<string, string> => {
    if (!reason) return {};
    const base = { name, email, reason };
    if (reason === "booking") return { ...base, date, venue, location, budget, message };
    if (reason === "collaboration") return { ...base, projectType, timeline, message };
    return { ...base, message };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingRef.current) return;

    if (!reason) {
      setFormErrors({ reason: "Choose an inquiry type." });
      firstReasonRef.current?.focus();
      return;
    }
    if (honeypotRef.current?.value) return;

    const sanitizedData = Object.fromEntries(
      Object.entries(buildFormData()).map(([key, value]) => [
        key,
        sanitizeText(value, null),
      ])
    ) as Record<string, string>;

    const result = contactSchemaByReason[reason].safeParse(sanitizedData);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0] ?? "general");
        if (!errors[field]) errors[field] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    const identifier = `${sanitizedData.name}-${sanitizedData.email}`;
    if (!rateLimiterRef.current.isAllowed(identifier)) {
      const resetTime = rateLimiterRef.current.getResetTime(identifier);
      const remainingTime = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));
      setFormErrors({ general: `Too many attempts. Try again in ${remainingTime} seconds.` });
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setFormErrors({ general: "The message service is unavailable. Please try again later." });
      return;
    }

    pendingRef.current = true;
    setSending(true);
    setSuccess(false);
    setFormErrors({});

    const emailMessage = buildEmailMessage({
      reason,
      ...(reason === "booking" && {
        date: sanitizedData.date,
        venue: sanitizedData.venue,
        location: sanitizedData.location,
        budget: BUDGET_OPTIONS.find((option) => option.value === sanitizedData.budget)?.label ?? sanitizedData.budget,
      }),
      ...(reason === "collaboration" && {
        projectType: PROJECT_TYPE_OPTIONS.find((option) => option.value === sanitizedData.projectType)?.label ?? sanitizedData.projectType,
        timeline: sanitizedData.timeline,
      }),
      message: sanitizedData.message,
    });

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: `Contact: ${reason}`,
          message: emailMessage,
        },
        publicKey
      );
      setSuccess(true);
    } catch {
      setFormErrors({
        general: "Your message could not be submitted. The details are still here so you can try again.",
      });
    } finally {
      pendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <p className={styles.kicker}>Contact / Helsinki</p>
        <h1 className="studioTitle">Get in touch</h1>
        <p className={styles.pageLead}>Booking, collaboration, or a note. Choose a route and send the relevant details. Thanks!</p>
      </div>

      <StudioWindow
        title="Contact / Random Gorsey"
        tone="paper"
        className={styles.contactWindow}
        actions={<span className={styles.windowStatus}>{success ? "SUBMITTED" : sending ? "SENDING" : "READY"}</span>}
      >
        <div className={styles.windowGrid}>
          <aside className={styles.aside}>
            <p id="contact-reason-label" className={styles.asideLabel}>Inquiry type</p>
            <div
              className={styles.reasonList}
              role="group"
              aria-labelledby="contact-reason-label"
              aria-describedby={formErrors.reason ? "contact-reason-error" : undefined}
            >
              {REASONS.map((option) => (
                <button
                  key={option.key}
                  ref={option.key === "booking" ? firstReasonRef : undefined}
                  type="button"
                  className={styles.reasonButton}
                  data-selected={reason === option.key}
                  aria-pressed={reason === option.key}
                  onClick={() => chooseReason(option.key)}
                  disabled={sending}
                >
                  <span className={styles.reasonIndex}>{option.index}</span>
                  <span>
                    <strong>{option.title}</strong>
                    <small>{option.subtitle}</small>
                  </span>
                </button>
              ))}
            </div>

            {reason && (
              <button
                type="button"
                className={styles.changeReason}
                onClick={resetReason}
                disabled={sending}
                aria-label="Change inquiry type"
              >
                Clear selection
              </button>
            )}

            {formErrors.reason && <p id="contact-reason-error" className={styles.asideError} role="alert">{formErrors.reason}</p>}

            <div className={styles.directLinks}>
              <a href="https://www.instagram.com/randomgorsey/" target="_blank" rel="noopener noreferrer">
                <span className={styles.directLinkLabel}>Instagram</span><span aria-hidden="true">↗</span>
              </a>
              <a href="https://soundcloud.com/randomgorsey" target="_blank" rel="noopener noreferrer">
                <span className={styles.directLinkLabel}>SoundCloud</span><span aria-hidden="true">↗</span>
              </a>
            </div>
          </aside>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {success ? (
              <div className={styles.success} role="status">
                <span className={styles.successMark} aria-hidden="true">✓</span>
                <h2>Message submitted</h2>
                <p className={styles.successCopy}>The message service accepted your submission. Keep this page open if you want to retain a copy of the details.</p>
                <button type="button" className={styles.secondaryButton} onClick={() => setSuccess(false)}>
                  View submitted details
                </button>
              </div>
            ) : (
              <>
                <div className={styles.identityFields}>
                  <Field id="contact-name" label="Name" error={formErrors.name}>
                    <input
                      id="contact-name"
                      className={styles.control}
                      value={name}
                      onChange={(event) => updateField("name", setName, event.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(formErrors.name)}
                      aria-describedby={formErrors.name ? "contact-name-error" : undefined}
                      disabled={sending}
                    />
                  </Field>
                  <Field id="contact-email" label="Email" error={formErrors.email}>
                    <input
                      id="contact-email"
                      className={styles.control}
                      type="email"
                      value={email}
                      onChange={(event) => updateField("email", setEmail, event.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(formErrors.email)}
                      aria-describedby={formErrors.email ? "contact-email-error" : undefined}
                      disabled={sending}
                    />
                  </Field>
                </div>

                {!reason && <div className={styles.emptyDetails}>Select an inquiry type to open the relevant fields.</div>}

                {reason === "booking" && (
                  <div className={styles.detailFields}>
                    <div className={styles.identityFields}>
                      <Field id="contact-date" label="Date or date range" error={formErrors.date}>
                        <input
                          id="contact-date"
                          className={styles.control}
                          value={date}
                          onChange={(event) => updateField("date", setDate, event.target.value)}
                          placeholder="e.g. 15 June 2027"
                          aria-invalid={Boolean(formErrors.date)}
                          aria-describedby={formErrors.date ? "contact-date-error" : undefined}
                          disabled={sending}
                        />
                      </Field>
                      <Field id="contact-venue" label="Venue or event" error={formErrors.venue}>
                        <input
                          id="contact-venue"
                          className={styles.control}
                          value={venue}
                          onChange={(event) => updateField("venue", setVenue, event.target.value)}
                          aria-invalid={Boolean(formErrors.venue)}
                          aria-describedby={formErrors.venue ? "contact-venue-error" : undefined}
                          disabled={sending}
                        />
                      </Field>
                    </div>
                    <div className={styles.identityFields}>
                      <Field id="contact-location" label="Location" error={formErrors.location}>
                        <input
                          id="contact-location"
                          className={styles.control}
                          value={location}
                          onChange={(event) => updateField("location", setLocation, event.target.value)}
                          aria-invalid={Boolean(formErrors.location)}
                          aria-describedby={formErrors.location ? "contact-location-error" : undefined}
                          disabled={sending}
                        />
                      </Field>
                      <Field id="contact-budget" label="Budget" error={formErrors.budget}>
                        <select
                          id="contact-budget"
                          className={styles.control}
                          value={budget}
                          onChange={(event) => updateField("budget", setBudget, event.target.value)}
                          aria-invalid={Boolean(formErrors.budget)}
                          aria-describedby={formErrors.budget ? "contact-budget-error" : undefined}
                          disabled={sending}
                        >
                          <option value="">Select a range</option>
                          {BUDGET_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </Field>
                    </div>
                    <MessageField
                      message={message}
                      error={formErrors.message}
                      sending={sending}
                      update={(value) => updateField("message", setMessage, value)}
                    />
                  </div>
                )}

                {reason === "collaboration" && (
                  <div className={styles.detailFields}>
                    <div className={styles.identityFields}>
                      <Field id="contact-project-type" label="Project type" error={formErrors.projectType}>
                        <select
                          id="contact-project-type"
                          className={styles.control}
                          value={projectType}
                          onChange={(event) => updateField("projectType", setProjectType, event.target.value)}
                          aria-invalid={Boolean(formErrors.projectType)}
                          aria-describedby={formErrors.projectType ? "contact-project-type-error" : undefined}
                          disabled={sending}
                        >
                          <option value="">Select a type</option>
                          {PROJECT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </Field>
                      <Field id="contact-timeline" label="Timeline" optional error={formErrors.timeline}>
                        <input
                          id="contact-timeline"
                          className={styles.control}
                          value={timeline}
                          onChange={(event) => updateField("timeline", setTimeline, event.target.value)}
                          aria-invalid={Boolean(formErrors.timeline)}
                          aria-describedby={formErrors.timeline ? "contact-timeline-error" : undefined}
                          disabled={sending}
                        />
                      </Field>
                    </div>
                    <MessageField
                      message={message}
                      error={formErrors.message}
                      sending={sending}
                      update={(value) => updateField("message", setMessage, value)}
                    />
                  </div>
                )}

                {reason === "hello" && (
                  <div className={styles.detailFields}>
                    <MessageField
                      message={message}
                      error={formErrors.message}
                      sending={sending}
                      rows={8}
                      update={(value) => updateField("message", setMessage, value)}
                    />
                  </div>
                )}

                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="contact-company">Company website</label>
                  <input ref={honeypotRef} id="contact-company" name="honeypot" tabIndex={-1} autoComplete="off" />
                </div>

                {formErrors.general && <p className={styles.generalError} role="alert">{formErrors.general}</p>}

                <div className={styles.sendBar}>
                  <button type="submit" className={styles.submitButton} disabled={sending}>
                    {sending ? "Sending…" : "Send message"}
                  </button>
                  <p className={styles.deliveryNote}>Delivery is handled by EmailJS. Submission shares the form details with that service so it can deliver the message.</p>
                </div>
              </>
            )}
          </form>
        </div>
      </StudioWindow>
    </div>
  );
};

interface MessageFieldProps {
  message: string;
  error?: string;
  sending: boolean;
  rows?: number;
  update: (value: string) => void;
}

function MessageField({ message, error, sending, rows = 6, update }: MessageFieldProps) {
  return (
    <Field id="contact-message" label="Message" error={error}>
      <textarea
        id="contact-message"
        className={styles.textarea}
        rows={rows}
        value={message}
        onChange={(event) => update(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "contact-message-error" : undefined}
        disabled={sending}
      />
    </Field>
  );
}

export default Contact;
