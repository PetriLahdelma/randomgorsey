import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import styles from './TextArea.module.css';

type TextAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
  cols?: number;
  error?: string;
  id?: string;
};

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder, label, className, rows, cols, error, id }) => {
  const textAreaId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div style={{ marginBottom: error ? '1.5rem' : '1rem' }} className={styles['text-area-container']}>
      {label && <label className={styles.label} htmlFor={textAreaId}>{label}</label>}
      <textarea
        id={textAreaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles['text-area']} ${className}`}
        rows={rows}
        cols={cols}
      ></textarea>
      {error && (
        <div className={styles['input-error']}>
          <ExclamationCircleIcon style={{ width: 18, height: 18, color: '#ff4d4f', marginRight: 6, verticalAlign: 'middle', display: 'inline-block' }} />
          <span role="alert" style={{ color: 'red', fontSize: '0.8em' }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
