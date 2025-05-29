import React from 'react';
import styles from './Contact.module.css'; // Import the CSS module for styling

const Contact: React.FC = () => {
  return (
    <div className={styles['contact-container']}>
      <h2>Contact</h2>
      <p className='contact-description'>This page provides contact details.</p>
    </div>
  );
};

export default Contact;