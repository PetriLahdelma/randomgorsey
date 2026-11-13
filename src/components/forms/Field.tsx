import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "./FormField.module.css";

export interface FieldProps {
  id: string;
  label?: ReactNode;
  error?: string;
  helpText?: ReactNode;
  children: ReactNode;
  optional?: boolean;
  required?: boolean;
  presentation?: "system" | "contact";
  className?: string;
}

export function Field({ id, label, error, helpText, children, optional = false, required = false, presentation = "system", className }: FieldProps) {
  return (
    <div className={cn(styles.field, className)} data-presentation={presentation}>
      {label && (
        <div className={styles.heading}>
          <label className={styles.label} htmlFor={id}>
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
          {optional && <span className={styles.optional}>Optional</span>}
        </div>
      )}
      {children}
      {helpText && !error && <p id={`${id}-help`} className={styles.helpText}>{helpText}</p>}
      {error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}
    </div>
  );
}

export { styles as formFieldStyles };
