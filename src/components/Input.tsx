import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Label from './Label';
import styles from './Input.module.css';

type InputProps = {
  type: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  id?: string;
};

const Input: React.FC<InputProps> = ({ type, value, onChange, onBlur, placeholder, label, className, error, id }) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const inputElement =
    type === 'textarea' ? (
      <textarea
        id={inputId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${styles.input} ${className}`}
      ></textarea>
    ) : (
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${styles.input} ${className}`}
      />
    );

  return (
    <div style={{ marginBottom: error ? '1.5rem' : '1rem' }} className={styles.inputContainer}>
      {label && <Label className={styles.label} style={{ color: '#00f' }} htmlFor={inputId}>{label}</Label>}
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
