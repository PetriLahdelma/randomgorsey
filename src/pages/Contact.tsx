import React, { useState } from 'react';
import styles from './Contact.module.css'; // Import the CSS module for styling
import { default as ContactButton } from '../components/Button';
import emailjs from 'emailjs-com';

const Contact: React.FC = () => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSend = () => {
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
      <h2>Contact</h2>
      <label className={styles['contact-label']}>Your Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className={styles['contact-input']}
      />
      <label className={styles['contact-label']}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        className={styles['contact-input']}
      />
      <label className={styles['contact-label']}>Subject</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className={styles['contact-input']}
      />
      <label className={styles['contact-label']}>Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
        className={styles['contact-textarea']}
      ></textarea>
      <ContactButton onClick={handleSend} className={styles['contact-button']}>
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
    </div>
  );
};

export default Contact;