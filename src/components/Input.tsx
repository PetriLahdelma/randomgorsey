import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/utils";
import type { BaseComponentProps, Size } from "../types/common";
import type { ValidationRule } from "../types/forms";
import Label from "./Label";
import styles from "./forms/FormField.module.css";

export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date" | "datetime-local" | "time" | "color" | "textarea";

export interface InputProps extends Omit<BaseComponentProps, "children"> {
  type: InputType;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  size?: Size;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  rows?: number;
  validation?: ValidationRule[];
  pattern?: string;
  step?: number | string;
  min?: number | string;
  max?: number | string;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  { type, value, onChange, onBlur, onFocus, placeholder, label, size = "medium", maxLength, minLength, autoComplete, autoFocus = false, helpText, icon, rows = 4, validation: _validation, pattern, step, min, max, className, style, id, testId, disabled = false, required = false, error, loading = false, ...accessibilityProps },
  ref
) {
  void _validation;
  const generatedId = useId();
  const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : `input-${generatedId.replace(/:/g, "")}`);
  const describedBy = error ? `${inputId}-error` : helpText ? `${inputId}-help` : accessibilityProps["aria-describedby"];
  const controlClassName = cn(styles.control, type === "textarea" && styles.textarea, icon && styles.withLeadingIcon, loading && styles.withTrailingIcon, className);
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
    className: controlClassName,
    style,
    "data-size": size,
    "data-loading": loading || undefined,
    "data-testid": testId,
    ...accessibilityProps,
    "aria-invalid": error ? ("true" as const) : ("false" as const),
    "aria-describedby": describedBy,
  };

  return (
    <div className={styles.field}>
      {label && <Label htmlFor={inputId} required={required}>{label}</Label>}
      <div className={styles.controlWrap}>
        {icon && !loading && <span className={styles.leadingIcon} aria-hidden="true">{icon}</span>}
        {type === "textarea" ? (
          <textarea {...commonProps} rows={rows} ref={ref as React.ForwardedRef<HTMLTextAreaElement>} />
        ) : (
          <input {...commonProps} type={type} ref={ref as React.ForwardedRef<HTMLInputElement>} />
        )}
        {loading && <span className={cn(styles.trailingIcon, styles.spinner)} aria-hidden="true">↻</span>}
      </div>
      {helpText && !error && <p className={styles.helpText} id={`${inputId}-help`}>{helpText}</p>}
      {error && <p className={styles.error} id={`${inputId}-error`} role="alert"><ExclamationCircleIcon className={styles.errorIcon} aria-hidden="true" /><span>{error}</span></p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
export { Input };
