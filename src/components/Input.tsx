import React from 'react';
import styles from './Input.module.css';

type InputProps = {
  type: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

const Input: React.FC<InputProps> = ({ type, value, onChange, placeholder, label, className }) => {
  const inputElement =
    type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${className}`}
      ></textarea>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${className}`}
      />
    );

  return (
    <div className={styles.inputContainer}>
      {label && <label className={styles.label}>{label}</label>}
      {inputElement}
    </div>
  );
};

export default Input;
