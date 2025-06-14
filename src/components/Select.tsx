import React from 'react';
import styles from './Select.module.css';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type Option = { label: string; value: string };

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder }) => (
  <div className={styles['select-wrapper']} style={{ position: 'relative', display: 'inline-block' }}>
    <select className={styles.select} value={value} onChange={onChange} aria-label="select">
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDownIcon className={styles['chevron-icon']} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', width: 20, height: 20, color: '#888' }} />
  </div>
);

export default Select;
