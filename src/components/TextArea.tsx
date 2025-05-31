import React from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
  cols?: number;
};

const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder, label, className, rows, cols }) => {
  return (
    <div className={styles.textAreaContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.textArea} ${className}`}
        rows={rows}
        cols={cols}
      ></textarea>
    </div>
  );
};

export default TextArea;
