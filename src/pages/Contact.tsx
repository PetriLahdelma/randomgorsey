import React, { useState } from 'react';
import styles from './Contact.module.css'; // Import the CSS module for styling
import ContactButton from '../components/Button';
import emailjs from 'emailjs-com';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Spinner from '../components/Spinner';

const Contact: React.FC = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    const honeypotField = document.querySelector('input[name=honeypot]') as HTMLInputElement;
    if (honeypotField && honeypotField.value) {
      console.error('Spam detected: Honeypot field is filled.');
      return;
    }

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
    .then((response) => {
      console.log('Email sent successfully!', response);
      setIsModalOpen(true);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
  };

  return (
    <div className={styles['contact-container']}>
      {loading && <Spinner />}
      {!loading && (
        <>
          <h2>Contact</h2>
          <div className={styles['contact-row']}>
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                label="Your Name"
                className={styles['contact-input']}
              />
            </div>
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                label="Email"
                className={styles['contact-input']}
              />
            </div>
          </div>
          <div className={styles['subject-row']}>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            label="Subject"
            className={styles['contact-input']}
          /></div>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            label="Message"
            className={styles['contact-textarea']}
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
            icon={<PaperAirplaneIcon className={styles['contact-icon']} />} // Updated icon with correct class
            className={styles['contact-button']}
          >
            Send
          </ContactButton>
          {isModalOpen && (
            <div className={styles['modal']}>
              <p>Message sent successfully!</p>
              <button onClick={() => setIsModalOpen(false)} className={styles['modal-close-button']}>
                Close
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Contact;