import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Label from "./Label";
import styles from "./Input.module.css";
import { BaseComponentProps, Size } from '../types/common';
import { ValidationRule } from '../types/forms';

/**
 * Input types supported by the component
 */
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "color"
  | "textarea";

/**
 * Props for the Input component
 */
export interface InputProps extends Omit<BaseComponentProps, 'children'> {
  /** Type of input field */
  type: InputType;
  /** Current value of the input */
  value: string;
  /** Change handler function */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /** Blur handler function */
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /** Focus handler function */
  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Size variant */
  size?: Size;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Minimum number of characters required */
  minLength?: number;
  /** Auto-complete attribute value */
  autoComplete?: string;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Help text to display below the input */
  helpText?: string;
  /** Icon to display inside the input */
  icon?: React.ReactNode;
  /** Number of rows for textarea */
  rows?: number;
  /** Validation rules */
  validation?: ValidationRule[];
  /** Pattern for input validation (regex) */
  pattern?: string;
  /** Step attribute for number inputs */
  step?: number | string;
  /** Minimum value for number/date inputs */
  min?: number | string;
  /** Maximum value for number/date inputs */
  max?: number | string;
}

/**
 * Reusable Input component with validation and accessibility features
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   required
 * />
 *
 * <Input
 *   type="textarea"
 *   label="Message"
 *   value={message}
 *   onChange={handleChange}
 *   helpText="Maximum 500 characters"
 *   maxLength={500}
 * />
 * ```
 */
const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  label,
  size = "medium",
  maxLength,
  minLength,
  autoComplete,
  autoFocus = false,
  helpText,
  icon,
  rows = 4,
  validation,
  pattern,
  step,
  min,
  max,
  className,
  style,
  id,
  testId,
  disabled = false,
  required = false,
  error,
  loading = false,
  ...accessibilityProps
}) => {
  const inputId =
    id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  // Combine CSS classes
  const inputClasses = [
    styles.input,
    styles[size],
    error ? styles.error : "",
    disabled ? styles.disabled : "",
    loading ? styles.loading : "",
    icon ? styles.withIcon : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const commonProps = {
    id: inputId,
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    disabled: disabled || loading,
    required,
    maxLength,
    minLength,
    autoComplete,
    autoFocus,
    pattern,
    step,
    min,
    max,
    className: inputClasses,
    style,
    "data-testid": testId,
    "aria-invalid": error ? ("true" as const) : ("false" as const),
    "aria-describedby": error
      ? `${inputId}-error`
      : helpText
      ? `${inputId}-help`
      : undefined,
    ...accessibilityProps,
  };

  const inputElement =
    type === "textarea" ? (
      <textarea {...commonProps} rows={rows} />
    ) : (
      <input {...commonProps} type={type} />
    );

  return (
    <div className={styles.inputContainer}>
      {label && (
        <Label className={styles.label} htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}

      <div className={styles.inputWrapper}>
        {icon && !loading && (
          <span className={styles.inputIcon} aria-hidden="true">
            {icon}
          </span>
        )}

        {loading && (
          <span className={styles.inputSpinner} aria-hidden="true">
            ⟳
          </span>
        )}

        {inputElement}
      </div>

      {helpText && !error && (
        <div className={styles.helpText} id={`${inputId}-help`}>
          {helpText}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage} id={`${inputId}-error`}>
          <ExclamationCircleIcon
            className={styles.errorIcon}
            aria-hidden="true"
          />
          <span role="alert">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
