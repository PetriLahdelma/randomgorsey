import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css'; // Import the CSS module for styling
import ContactButton from '../components/Button';
import emailjs from '@emailjs/browser';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Spinner from '../components/Spinner';
import { contactFormSchema } from '../utils/validation';
import Button from '../components/Button';
import PageMeta from '../components/PageMeta';

const Contact: React.FC = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    // Validate with zod
    const result = contactFormSchema.safeParse({ name, email, subject, message });
    if (!result.success) {
      // Map zod errors to formErrors
      const errors: { name?: string; email?: string; subject?: string; message?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as keyof typeof errors] = err.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const honeypotField = document.querySelector('input[name=honeypot]') as HTMLInputElement;
    if (honeypotField && honeypotField.value) {
      // Optionally show a user-friendly error or silently fail for spam
      return;
    }
    setSending(true);
    emailjs.send(
      'service_kua7hu3',
      'template_wr7fpxc',
      {
        name,
        email,
        subject,
        message,
      },
      '-BdVWUzt4g0H07ZtM'
    )
      .then(() => {
        setIsModalOpen(true);
        setSending(false);
      })
      .catch(() => {
        setSending(false);
        setFormErrors((prev) => ({ ...prev, general: 'Failed to send message. Please try again later.' }));
      });
  };

  const handleInputChange = (field: 'name' | 'email' | 'subject' | 'message', value: string) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'subject') setSubject(value);
    if (field === 'message') setMessage(value);
    // Remove error for this field if value is now valid
    const result = contactFormSchema.safeParse({
      name: field === 'name' ? value : name,
      email: field === 'email' ? value : email,
      subject: field === 'subject' ? value : subject,
      message: field === 'message' ? value : message,
    });
    if (result.success) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      const errorForField = result.error.errors.find((err) => err.path[0] === field);
      setFormErrors((prev) => ({ ...prev, [field]: errorForField ? errorForField.message : undefined }));
    }
  };

  return (
    <>
      <PageMeta title="Contact | Random Gorsey" description="Send a message to Random Gorsey." path="/contact" />
      <motion.div
      className={styles['contact-container']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading && <Spinner />}
      {sending && <Spinner />}
      {!loading && !sending && (
        <>
          <h2>Contact</h2>
          <div className={styles['contact-row']}>
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your Name"
                label="Your Name"
                className={styles['contact-input']}
                error={formErrors.name}
              />
            </div>
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="@ Your Email"
                label="Email"
                className={styles['contact-input']}
                error={formErrors.email}
              />
            </div>
          </div>
          <div className={styles['subject-row']}>
          <Input
            type="text"
            value={subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Subject"
            label="Subject"
            className={styles['contact-input']}
            error={formErrors.subject}
          /></div>
          <TextArea 
            value={message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Write your message here..."
            label="Message"
            className={styles['contact-textarea']}
            error={formErrors.message}
          />
          <input
            type="text"
            name="honeypot"
            style={{ display: 'none' }}
            value=""
            onChange={() => {}}
          />
          <ContactButton
            variant="primary"
            onClick={handleSend}
            icon={<PaperAirplaneIcon className={styles['contact-icon']} />}
            className={styles['contact-button']}
          >
            Send
          </ContactButton>
          {isModalOpen && (
            <div className={styles['modal']}>
              <p>Message sent successfully!</p>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  // Reset form fields and errors after closing modal
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                  setFormErrors({});
                }}
                className={styles['modal-close-button']}
              >
                Close
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
    </>
  );
};

export default Contact;