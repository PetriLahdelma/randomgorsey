import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/utils";
import Label from "./Label";
import styles from "./forms/FormField.module.css";

export type TextAreaProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
  cols?: number;
  error?: string;
  helpText?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  autoComplete?: string;
  maxLength?: number;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { value, onChange, placeholder, label, className, rows, cols, error, helpText, id, disabled = false, required = false, loading = false, autoComplete, maxLength },
  ref
) {
  const generatedId = useId();
  const textAreaId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : `textarea-${generatedId.replace(/:/g, "")}`);
  return (
    <div className={styles.field}>
      {label && <Label htmlFor={textAreaId} required={required}>{label}</Label>}
      <textarea ref={ref} id={textAreaId} value={value} onChange={onChange} placeholder={placeholder} className={cn(styles.control, styles.textarea, className)} rows={rows} cols={cols} disabled={disabled || loading} required={required} autoComplete={autoComplete} maxLength={maxLength} data-loading={loading || undefined} aria-invalid={error ? "true" : "false"} aria-describedby={error ? `${textAreaId}-error` : helpText ? `${textAreaId}-help` : undefined} />
      {helpText && !error && <p id={`${textAreaId}-help`} className={styles.helpText}>{helpText}</p>}
      {error && <p id={`${textAreaId}-error`} className={styles.error} role="alert"><ExclamationCircleIcon className={styles.errorIcon} aria-hidden="true" />{error}</p>}
    </div>
  );
});

TextArea.displayName = "TextArea";
export default TextArea;
export { TextArea };
