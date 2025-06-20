import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Label from './Label';
import styles from './Input.module.css';

type InputProps = {
  type: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
};

const Input: React.FC<InputProps> = ({ type, value, onChange, placeholder, label, className, error }) => {
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
    <div style={{ marginBottom: error ? '1.5rem' : '1rem' }} className={styles.inputContainer}>
      {label && <Label className={styles.label} style={{ color: '#00f' }}>{label}</Label>}
      {inputElement}
      {error && (
        <div className={styles['input-error']}>
          <ExclamationCircleIcon
            style={{
              width: 18,
              height: 18,
              color: '#ff4d4f',
              marginRight: 6,
              verticalAlign: 'middle',
              display: 'inline-block',
            }}
          />
          <span role="alert" style={{ color: 'red', fontSize: '0.8em' }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
