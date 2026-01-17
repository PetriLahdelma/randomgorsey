import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Contact.module.css"; // Import the CSS module for styling
import ContactButton from "../components/Button";
import emailjs from "@emailjs/browser";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Spinner from "../components/Spinner";
import { contactFormSchema } from "../utils/validation";
import Button from "../components/Button";
import PageMeta from "../components/PageMeta";
import { isWebMSupported } from "../utils/isWebMSupported";
import { isIOS } from "../utils/isIOS";
import { validateAndSanitizeContactForm, RateLimiter } from "../utils/security";
import contactCanvasVideo from "../videos/contact_canvas.webm";

const Contact: React.FC = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    general?: string;
  }>({});

  // Rate limiter for contact form submissions (5 attempts per minute per user)
  const rateLimiter = new RateLimiter(5, 60 * 1000);

  const Container: React.ElementType = isIOS() ? "div" : motion.div;

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize EmailJS
  React.useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      console.error("EmailJS public key not found in environment variables");
    }
  }, []);

  const handleSend = () => {
    // Check rate limiting first
    const userIdentifier = `${name}-${email}`; // Simple identifier (in production, use IP or session)
    if (!rateLimiter.isAllowed(userIdentifier)) {
      const resetTime = rateLimiter.getResetTime(userIdentifier);
      const remainingTime = Math.ceil((resetTime - Date.now()) / 1000);
      setFormErrors({
        general: `Too many attempts. Please wait ${remainingTime} seconds before trying again.`,
      });
      return;
    }

    // Security validation and sanitization
    const securityValidation = validateAndSanitizeContactForm({
      name,
      email,
      subject,
      message,
    });

    if (!securityValidation.isValid) {
      setFormErrors(securityValidation.errors);
      return;
    }

    // Use sanitized data for further processing
    const sanitizedData = securityValidation.sanitizedData;

    // Additional validation with zod (keeping existing validation)
    const result = contactFormSchema.safeParse(sanitizedData);
    if (!result.success) {
      // Map zod errors to formErrors
      const errors: {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
      } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0])
          errors[err.path[0] as keyof typeof errors] = err.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Honeypot spam check
    const honeypotField = document.querySelector(
      "input[name=honeypot]"
    ) as HTMLInputElement;
    if (honeypotField && honeypotField.value) {
      // Silently fail for spam (don't give feedback to bots)
      console.warn("Honeypot field filled - potential spam");
      return;
    }

    setSending(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS configuration missing in environment variables");
      setSending(false);
      setFormErrors((prev) => ({
        ...prev,
        general: "Email service configuration error. Please try again later.",
      }));
      return;
    }

    emailjs
      .send(
        serviceId,
        templateId,
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
        },
        publicKey
      )
      .then(() => {
        setIsModalOpen(true);
        setSending(false);
        // Clear form on success
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        setSending(false);
        setFormErrors((prev) => ({
          ...prev,
          general: "Failed to send message. Please try again later.",
        }));
      });
  };

  const handleInputChange = (
    field: "name" | "email" | "subject" | "message",
    value: string
  ) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "subject") setSubject(value);
    if (field === "message") setMessage(value);
    // Remove error for this field if value is now valid
    const result = contactFormSchema.safeParse({
      name: field === "name" ? value : name,
      email: field === "email" ? value : email,
      subject: field === "subject" ? value : subject,
      message: field === "message" ? value : message,
    });
    if (result.success) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const errorForField = result.error.issues.find(
        (err) => err.path[0] === field
      );
      setFormErrors((prev) => ({
        ...prev,
        [field]: errorForField ? errorForField.message : undefined,
      }));
    }
  };

  return (
    <>
      <PageMeta
        title="Contact | Random Gorsey"
        description="Send a message to Random Gorsey."
        path="/contact"
      />
      {/* Background looping video (disabled if WebM unsupported) */}
      {isWebMSupported() && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source
            src={contactCanvasVideo}
            type="video/webm"
          />
        </video>
      )}
      <Container
        className={styles["contact-container"]}
        {...(!isIOS() && {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        })}
      >
        {loading && <Spinner />}
        {sending && <Spinner />}
        {!loading && !sending && (
          <>
            <h1>Contact</h1>
            <div className={styles["contact-row"]}>
              <div>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="@ Your Email"
                  label="Email"
                  className={styles["contact-input"]}
                  error={formErrors.email}
                />
              </div>
            </div>
            <div className={styles["subject-row"]}>
              <Input
                type="text"
                value={subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Subject"
                label="Subject"
                className={styles["contact-input"]}
                error={formErrors.subject}
              />
            </div>
            <TextArea
              value={message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Write your message here..."
              label="Message"
              className={styles["contact-textarea"]}
              error={formErrors.message}
            />
            {formErrors.general && (
              <div className={styles["error-message"]} role="alert">
                {formErrors.general}
              </div>
            )}
            <input
              type="text"
              name="honeypot"
              style={{ display: "none" }}
              value=""
              onChange={() => {}}
            />
            <ContactButton
              variant="primary"
              onClick={handleSend}
              icon={<PaperAirplaneIcon className={styles["contact-icon"]} />}
              className={styles["contact-button"]}
              aria-label="Send message"
            >
              Send
            </ContactButton>
            <div className={styles["disclaimer"]}>
              <p className={styles["disclaimer-text"]}>
                By submitting this form, you agree that your personal
                information (name, email, and message) will be used to respond
                to your inquiry. Your data will not be shared with third parties
                and will be handled in accordance with our privacy practices. We
                may retain your message for record-keeping purposes.
              </p>
            </div>
            {isModalOpen && (
              <div className={styles["modal"]}>
                <p>Message sent successfully!</p>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    // Reset form fields and errors after closing modal
                    setName("");
                    setEmail("");
                    setSubject("");
                    setMessage("");
                    setFormErrors({});
                  }}
                  className={styles["modal-close-button"]}
                >
                  Close
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Contact;
