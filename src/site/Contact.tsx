"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  contactVariants,
  bodyTextVariants,
} from "@/lib/motion";
import { usePerformance } from "@/lib/performance";
import { cn } from "@/lib/utils";
import styles from "./Contact.module.css";
import emailjs from "@emailjs/browser";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Spinner from "../components/Spinner";
import {
  ContactReason,
  contactSchemaByReason,
} from "../utils/validation";
import { sanitizeText, RateLimiter } from "../utils/security";
import { VideoBackground, AmbientLayer } from "@/components/effects";

const contactCanvasVideo = "/videos/contact_canvas.webm";

interface ReasonOption {
  key: ContactReason;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const ReasonIcon = ({ type }: { type: ContactReason }) => {
  const cls = "w-5 h-5 stroke-current";
  switch (type) {
    case "booking":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "collaboration":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      );
    case "hello":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      );
  }
};

const REASONS: ReasonOption[] = [
  {
    key: "booking",
    title: "Booking & Events",
    subtitle: "Gigs, festivals, DJ sets",
    icon: <ReasonIcon type="booking" />,
  },
  {
    key: "collaboration",
    title: "Collaboration",
    subtitle: "Remixes, tracks, projects",
    icon: <ReasonIcon type="collaboration" />,
  },
  {
    key: "hello",
    title: "Just saying hello",
    subtitle: "Fan mail, questions, whatever",
    icon: <ReasonIcon type="hello" />,
  },
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

const selectStyles =
  "w-full py-3 px-4 bg-[oklch(5%_0_0deg)] text-foreground border border-[oklch(14%_0_0deg)] font-mono-label text-sm tracking-wider focus:outline-none focus:border-accent transition-colors appearance-none";

const labelStyles =
  "mb-2 block font-mono-label text-muted-foreground text-xs uppercase tracking-widest label-signal";

/* Stagger helpers */
const fieldReveal = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isTyping, setIsTyping] = useState(false);
  const [showSuccessRing, setShowSuccessRing] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleInput = useCallback(() => {
    setIsTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
  }, []);

  const rateLimiterRef = useRef(new RateLimiter(5, 60 * 1000));
  const { tier, isReducedMotion } = usePerformance();
  const shouldAnimate = tier >= 2 && !isReducedMotion;

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

    const honeypotField = document.querySelector(
      "input[name=honeypot]"
    ) as HTMLInputElement;
    if (honeypotField && honeypotField.value) {
      return;
    }

    const rawData = buildFormData();
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawData)) {
      sanitizedData[key] = sanitizeText(value);
    }

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
        setShowSuccessRing(true);
        setTimeout(() => setShowSuccessRing(false), 500);
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        setSending(false);
        setFormErrors({
          general: "Failed to send message. Please try again later.",
        });
      });
  };

  /* Step progress: 0 = identity, 1 = reason, 2 = details */
  const step = !name && !email ? 0 : !reason ? 1 : 2;

  return (
    <>
      <AmbientLayer variant="contact" typing={isTyping} />
      <VideoBackground
        src={contactCanvasVideo}
        poster="/images/contact-poster.jpg"
        overlayOpacity={0.25}
      />
      <motion.div
        className="relative z-10 min-h-screen grain-overlay"
        data-section="contact"
        variants={contactVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 py-10 md:py-16">
          <div className="bg-[oklch(7%_0_0deg)] border border-[oklch(12%_0_0deg)] overflow-hidden">

            {success ? (
              /* ── Success State ── */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="py-20 md:py-28 px-8 flex flex-col items-center text-center"
              >
                <div className={styles["success-check"]}>
                  <svg viewBox="0 0 24 24">
                    <path className={styles["check-draw"]} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-foreground font-europa-light text-2xl uppercase tracking-[0.15em] mb-3"
                >
                  Message sent
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-muted-foreground text-sm max-w-xs"
                >
                  Thanks for reaching out. I&apos;ll get back to you as soon as I can.
                </motion.p>
              </motion.div>
            ) : sending ? (
              /* ── Sending State ── */
              <div className="py-24 flex flex-col items-center gap-4">
                <Spinner className="border-white/10 border-t-accent" />
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-mono-label">
                  Sending
                </p>
              </div>
            ) : (
              /* ── Form Layout ── */
              <div className={styles["contact-grid"]} onInput={handleInput}>

                {/* ── Left Panel: Intro & Direct Links ── */}
                <div className={styles["contact-aside"]}>
                  <div>
                    <div className={styles["accent-rule"]} />
                    <h1 className="text-foreground font-europa-light text-3xl md:text-4xl uppercase tracking-[0.15em] mb-4">
                      Get in<br />touch
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
                      Whether it&apos;s a gig, a collaboration, or just a conversation.
                      Fill out the form and I&apos;ll respond personally.
                    </p>

                    {/* Step indicator */}
                    <div className={styles["step-indicator"]}>
                      {[0, 1, 2].map((s) => (
                        <div
                          key={s}
                          className={cn(
                            styles["step-dot"],
                            s === step && styles["step-dot-active"],
                            s < step && styles["step-dot-complete"]
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Direct links */}
                  <div className="hidden md:flex flex-col mt-auto pt-8">
                    <a
                      href="https://www.instagram.com/randomgorsey/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["direct-link"]}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                      </svg>
                      Instagram
                    </a>
                    <a
                      href="https://soundcloud.com/randomgorsey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles["direct-link"]}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 18V12m3 6V8m3 10V6m3 12v-6m3 6V4m3 14V10" />
                      </svg>
                      SoundCloud
                    </a>
                  </div>
                </div>

                {/* ── Right Panel: Form ── */}
                <div className={styles["contact-form-panel"]}>
                  <div className="flex flex-col gap-5">

                    {/* Name & Email */}
                    <motion.div
                      variants={fieldReveal}
                      initial="hidden"
                      animate="show"
                      custom={0}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setFormErrors((prev) => clearError(prev, "name"));
                        }}
                        placeholder="Your Name"
                        label="Name"
                        error={formErrors.name}
                      />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFormErrors((prev) => clearError(prev, "email"));
                        }}
                        placeholder="your@email.com"
                        label="Email"
                        error={formErrors.email}
                      />
                    </motion.div>

                    {/* Reason selector */}
                    <motion.div
                      variants={fieldReveal}
                      initial="hidden"
                      animate="show"
                      custom={1}
                    >
                      <div className="flex items-baseline gap-3 mb-3">
                        <label className={labelStyles}>
                          What&apos;s this about?
                        </label>
                        {reason && (
                          <button
                            type="button"
                            onClick={handleReasonReset}
                            className="text-xs text-accent underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 font-mono-label"
                          >
                            Change
                          </button>
                        )}
                      </div>
                      <div className={styles["reason-cards"]}>
                        {REASONS.map((r) => {
                          const isSelected = reason === r.key;
                          const isHidden = reason !== null && !isSelected;
                          if (isHidden) return null;
                          return (
                            <motion.button
                              key={r.key}
                              type="button"
                              onClick={() => handleReasonChange(r.key)}
                              className={cn(
                                styles["reason-card"],
                                isSelected && styles["reason-card-selected"]
                              )}
                              layout
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <span className="block text-muted-foreground mb-3">
                                {r.icon}
                              </span>
                              <span className="block text-foreground font-mono-label text-sm uppercase tracking-wider">
                                {r.title}
                              </span>
                              <span className="block text-muted-foreground text-xs mt-1">
                                {r.subtitle}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                      {formErrors.reason && (
                        <p className="text-red-400 text-sm mt-2">{formErrors.reason}</p>
                      )}
                    </motion.div>

                    {/* Conditional fields */}
                    <AnimatePresence mode="wait">
                      {reason === "booking" && (
                        <motion.div
                          key="booking-fields"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-col gap-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                              type="text"
                              value={date}
                              onChange={(e) => {
                                setDate(e.target.value);
                                setFormErrors((prev) => clearError(prev, "date"));
                              }}
                              placeholder="e.g. June 15, 2026"
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
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <div className="flex flex-col">
                              <label htmlFor="budget" className={labelStyles}>
                                Budget
                              </label>
                              <select
                                id="budget"
                                value={budget}
                                onChange={(e) => {
                                  setBudget(e.target.value);
                                  setFormErrors((prev) => clearError(prev, "budget"));
                                }}
                                className={selectStyles}
                              >
                                <option value="">Select range</option>
                                {BUDGET_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {formErrors.budget && (
                                <p className="text-red-400 text-sm mt-1">{formErrors.budget}</p>
                              )}
                            </div>
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
                        </motion.div>
                      )}

                      {reason === "collaboration" && (
                        <motion.div
                          key="collab-fields"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-col gap-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label htmlFor="project-type" className={labelStyles}>
                                Project type
                              </label>
                              <select
                                id="project-type"
                                value={projectType}
                                onChange={(e) => {
                                  setProjectType(e.target.value);
                                  setFormErrors((prev) => clearError(prev, "projectType"));
                                }}
                                className={selectStyles}
                              >
                                <option value="">Select type</option>
                                {PROJECT_TYPE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {formErrors.projectType && (
                                <p className="text-red-400 text-sm mt-1">{formErrors.projectType}</p>
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
                          </div>
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
                        </motion.div>
                      )}

                      {reason === "hello" && (
                        <motion.div
                          key="hello-fields"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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

                    {/* General error */}
                    {formErrors.general && (
                      <div
                        className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/30"
                        role="alert"
                      >
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

                    {/* Send bar */}
                    {reason && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={styles["send-bar"]}
                      >
                        <button
                          type="button"
                          onClick={handleSend}
                          className="bg-accent text-accent-foreground px-10 py-3 font-mono-label text-sm uppercase tracking-wider hover:bg-yellow-500 transition-colors"
                        >
                          Send message
                        </button>
                        <span className="hidden sm:block text-muted-foreground text-xs">
                          I&apos;ll respond within a few days
                        </span>
                      </motion.div>
                    )}

                    {/* Disclaimer */}
                    <motion.p
                      variants={shouldAnimate ? bodyTextVariants : undefined}
                      initial={shouldAnimate ? "hidden" : undefined}
                      whileInView={shouldAnimate ? "visible" : undefined}
                      viewport={{ once: true }}
                      className="text-[0.65rem] leading-relaxed text-neutral-600 mt-1"
                    >
                      By submitting this form, you agree that your personal
                      information (name, email, and message) will be used to respond
                      to your inquiry. Your data will not be shared with third parties
                      and will be handled in accordance with our privacy practices.
                    </motion.p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </motion.div>
      {showSuccessRing && <div className="submit-success-ring" aria-hidden="true" />}
    </>
  );
};

export default Contact;
