"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  contactVariants,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import styles from "./Contact.module.css";
import emailjs from "@emailjs/browser";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Spinner from "../components/Spinner";
import {
  ContactReason,
  contactSchemaByReason,
} from "../utils/validation";
import Button from "../components/Button";
import PageMeta from "../components/PageMeta";
import { sanitizeText, RateLimiter } from "../utils/security";
import { VideoBackground } from "@/components/effects";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";

const contactCanvasVideo = "/videos/contact_canvas.webm";

interface ReasonOption {
  key: ContactReason;
  title: string;
  subtitle: string;
}

const REASONS: ReasonOption[] = [
  { key: "booking", title: "Booking & Events", subtitle: "Gigs, festivals, DJ sets" },
  { key: "collaboration", title: "Collaboration", subtitle: "Remixes, tracks, projects" },
  { key: "hello", title: "Just saying hello", subtitle: "Fan mail, questions, whatever" },
];

const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under \u20AC500" },
  { value: "500-1000", label: "\u20AC500\u2013\u20AC1,000" },
  { value: "1000-2500", label: "\u20AC1,000\u2013\u20AC2,500" },
  { value: "2500-plus", label: "\u20AC2,500+" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

const PROJECT_TYPE_OPTIONS = [
  { value: "remix", label: "Remix" },
  { value: "track", label: "Track" },
  { value: "other", label: "Other" },
] as const;

function buildEmailMessage(fields: Record<string, string | undefined>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value) {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());
      lines.push(`${label}: ${value}`);
    }
  }
  return lines.join("\n");
}

function clearError(prev: Record<string, string>, field: string): Record<string, string> {
  const next = { ...prev };
  delete next[field];
  return next;
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
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const rateLimiterRef = useRef(new RateLimiter(5, 60 * 1000));

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  const resetReasonFields = () => {
    setMessage("");
    setDate("");
    setVenue("");
    setLocation("");
    setBudget("");
    setProjectType("");
    setTimeline("");
    setFormErrors({});
  };

  const handleReasonChange = (r: ContactReason) => {
    resetReasonFields();
    setReason(r);
  };

  const handleReasonReset = () => {
    resetReasonFields();
    setReason(null);
  };

  const buildFormData = (): Record<string, string> => {
    if (!reason) return {};
    const base = { name, email, reason };
    switch (reason) {
      case "booking":
        return { ...base, date, venue, location, budget, message };
      case "collaboration":
        return { ...base, projectType, timeline, message };
      case "hello":
        return { ...base, message };
    }
  };

  const handleSend = () => {
    if (!reason) {
      setFormErrors({ reason: "Please select a reason" });
      return;
    }

    const userIdentifier = `${name}-${email}`;
    if (!rateLimiterRef.current.isAllowed(userIdentifier)) {
      const resetTime = rateLimiterRef.current.getResetTime(userIdentifier);
      const remainingTime = Math.ceil((resetTime - Date.now()) / 1000);
      setFormErrors({
        general: `Too many attempts. Please wait ${remainingTime} seconds before trying again.`,
      });
      return;
    }

    // Honeypot check
    const honeypotField = document.querySelector(
      "input[name=honeypot]"
    ) as HTMLInputElement;
    if (honeypotField && honeypotField.value) {
      return;
    }

    // Sanitize inputs
    const rawData = buildFormData();
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawData)) {
      sanitizedData[key] = sanitizeText(value);
    }

    // Validate with reason-specific Zod schema
    const schema = contactSchemaByReason[reason];
    const result = schema.safeParse(sanitizedData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) errors[String(field)] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSending(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setSending(false);
      setFormErrors({
        general: "Email service configuration error. Please try again later.",
      });
      return;
    }

    const emailMessage = buildEmailMessage({
      reason: reason,
      ...(reason === "booking" && {
        date: sanitizedData.date,
        venue: sanitizedData.venue,
        location: sanitizedData.location,
        budget: BUDGET_OPTIONS.find((o) => o.value === sanitizedData.budget)?.label ?? sanitizedData.budget,
      }),
      ...(reason === "collaboration" && {
        projectType: PROJECT_TYPE_OPTIONS.find((o) => o.value === sanitizedData.projectType)?.label ?? sanitizedData.projectType,
        timeline: sanitizedData.timeline,
      }),
      message: sanitizedData.message,
    });

    emailjs
      .send(
        serviceId,
        templateId,
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: `Contact: ${reason}`,
          message: emailMessage,
        },
        publicKey
      )
      .then(() => {
        setSending(false);
        setSuccess(true);
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        setSending(false);
        setFormErrors({
          general: "Failed to send message. Please try again later.",
        });
      });
  };

  if (success) {
    return (
      <>
        <PageMeta
          title="Contact | Random Gorsey"
          description="Send a message to Random Gorsey."
          path="/contact/"
        />
        <VideoBackground
          src={contactCanvasVideo}
          poster="/images/contact-poster.jpg"
          overlayOpacity={0.25}
        />
        <motion.div
          className={cn(styles["contact-container"], "grain-overlay")}
          data-section="contact"
          variants={contactVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Container size="sm" padding="md">
            <Stack gap="md" align="center">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-foreground text-lg font-mono-label"
              >
                Got it &mdash; I&apos;ll get back to you.
              </motion.p>
            </Stack>
          </Container>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Contact | Random Gorsey"
        description="Send a message to Random Gorsey."
        path="/contact/"
      />
      <VideoBackground
        src={contactCanvasVideo}
        poster="/images/contact-poster.jpg"
        overlayOpacity={0.25}
      />
      <motion.div
        className={cn(styles["contact-container"], "grain-overlay")}
        data-section="contact"
        variants={contactVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {loading && <Spinner />}
        {sending && <Spinner />}
        {!loading && !sending && (
          <Container size="sm" padding="md">
            <Stack gap="md" align="stretch">
              <h1 className="text-foreground font-heading text-3xl uppercase tracking-wider text-center">
                Contact
              </h1>

              {/* Always visible: name & email */}
              <div className={styles["contact-row"]}>
                <div>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormErrors((prev) => clearError(prev, "name"));
                    }}
                    placeholder="Your Name"
                    label="Your Name"
                    className={styles["contact-input"]}
                    error={formErrors.name}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormErrors((prev) => clearError(prev, "email"));
                    }}
                    placeholder="@ Your Email"
                    label="Email"
                    className={styles["contact-input"]}
                    error={formErrors.email}
                  />
                </div>
              </div>

              {/* Reason selector */}
              <div>
                <label className="mb-2 block font-mono-label text-muted-foreground text-xs uppercase tracking-widest">
                  What&apos;s this about?
                </label>
                {reason && (
                  <button
                    type="button"
                    onClick={handleReasonReset}
                    className="mb-3 text-xs text-accent underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 font-mono-label uppercase tracking-wider"
                  >
                    Change
                  </button>
                )}
                <div className={styles["reason-cards"]}>
                  {REASONS.map((r) => {
                    const isSelected = reason === r.key;
                    const isHidden = reason !== null && !isSelected;
                    if (isHidden) return null;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => handleReasonChange(r.key)}
                        className={cn(
                          styles["reason-card"],
                          isSelected && styles["reason-card-selected"]
                        )}
                      >
                        <span className="block text-foreground font-mono-label text-sm uppercase tracking-wider">
                          {r.title}
                        </span>
                        <span className="block text-muted-foreground text-xs mt-1">
                          {r.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {formErrors.reason && (
                  <p className="text-destructive text-sm mt-1">{formErrors.reason}</p>
                )}
              </div>

              {/* Conditional fields */}
              <AnimatePresence mode="wait">
                {reason === "booking" && (
                  <motion.div
                    key="booking-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Stack gap="sm" align="stretch">
                      <Input
                        type="text"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setFormErrors((prev) => clearError(prev, "date"));
                        }}
                        placeholder="e.g. June 15, 2026 or June 15-17"
                        label="Date or date range"
                        error={formErrors.date}
                      />
                      <Input
                        type="text"
                        value={venue}
                        onChange={(e) => {
                          setVenue(e.target.value);
                          setFormErrors((prev) => clearError(prev, "venue"));
                        }}
                        placeholder="Venue or event name"
                        label="Venue / Event"
                        error={formErrors.venue}
                      />
                      <Input
                        type="text"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setFormErrors((prev) => clearError(prev, "location"));
                        }}
                        placeholder="City, Country"
                        label="Location"
                        error={formErrors.location}
                      />
                      <div className="flex flex-col w-full mb-4">
                        <label
                          htmlFor="budget"
                          className="mb-2 font-mono-label text-muted-foreground text-xs uppercase tracking-widest"
                        >
                          Budget
                        </label>
                        <select
                          id="budget"
                          value={budget}
                          onChange={(e) => {
                            setBudget(e.target.value);
                            setFormErrors((prev) => clearError(prev, "budget"));
                          }}
                          className="w-full py-2 px-3 bg-background text-foreground border border-border font-mono-label text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                        >
                          <option value="">Select budget range</option>
                          {BUDGET_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.budget && (
                          <p className="text-destructive text-sm mt-1">{formErrors.budget}</p>
                        )}
                      </div>
                      <TextArea
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setFormErrors((prev) => clearError(prev, "message"));
                        }}
                        placeholder="Tell me about the event..."
                        label="Message"
                        rows={5}
                        error={formErrors.message}
                      />
                    </Stack>
                  </motion.div>
                )}

                {reason === "collaboration" && (
                  <motion.div
                    key="collab-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Stack gap="sm" align="stretch">
                      <div className="flex flex-col w-full mb-4">
                        <label
                          htmlFor="project-type"
                          className="mb-2 font-mono-label text-muted-foreground text-xs uppercase tracking-widest"
                        >
                          Project type
                        </label>
                        <select
                          id="project-type"
                          value={projectType}
                          onChange={(e) => {
                            setProjectType(e.target.value);
                            setFormErrors((prev) => clearError(prev, "projectType"));
                          }}
                          className="w-full py-2 px-3 bg-background text-foreground border border-border font-mono-label text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                        >
                          <option value="">Select project type</option>
                          {PROJECT_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.projectType && (
                          <p className="text-destructive text-sm mt-1">{formErrors.projectType}</p>
                        )}
                      </div>
                      <Input
                        type="text"
                        value={timeline}
                        onChange={(e) => {
                          setTimeline(e.target.value);
                          setFormErrors((prev) => clearError(prev, "timeline"));
                        }}
                        placeholder="e.g. Q3 2026, flexible"
                        label="Timeline (optional)"
                      />
                      <TextArea
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setFormErrors((prev) => clearError(prev, "message"));
                        }}
                        placeholder="Describe the project..."
                        label="Message"
                        rows={5}
                        error={formErrors.message}
                      />
                    </Stack>
                  </motion.div>
                )}

                {reason === "hello" && (
                  <motion.div
                    key="hello-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <TextArea
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setFormErrors((prev) => clearError(prev, "message"));
                      }}
                      placeholder="What's on your mind?"
                      label="Message"
                      rows={5}
                      error={formErrors.message}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {formErrors.general && (
                <div className={styles["error-message"]} role="alert">
                  {formErrors.general}
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                style={{ display: "none" }}
                value=""
                onChange={() => {}}
              />

              {reason && (
                <Button
                  variant="primary"
                  onClick={handleSend}
                  icon={<PaperAirplaneIcon className="w-4 h-4" />}
                  fullWidth
                  aria-label="Send message"
                >
                  Send
                </Button>
              )}

              <div className={styles["disclaimer"]}>
                <p className={styles["disclaimer-text"]}>
                  By submitting this form, you agree that your personal
                  information (name, email, and message) will be used to respond
                  to your inquiry. Your data will not be shared with third parties
                  and will be handled in accordance with our privacy practices. We
                  may retain your message for record-keeping purposes.
                </p>
              </div>
            </Stack>
          </Container>
        )}
      </motion.div>
    </>
  );
};

export default Contact;
