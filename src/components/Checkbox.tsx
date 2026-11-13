import { forwardRef, useId } from "react";

import { cn } from "@/lib/utils";
import styles from "./forms/FormField.module.css";

export type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, checked, onChange, disabled = false, className, id, required = false, helpText, error, name, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }, ref) {
  const generatedId = useId();
  const checkboxId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : `checkbox-${generatedId.replace(/:/g, "")}`);
  const describedBy = error ? `${checkboxId}-error` : helpText ? `${checkboxId}-help` : undefined;
  return (
    <div className={styles.field}>
      <label className={styles.checkboxLabel} data-disabled={disabled || undefined}>
        <input ref={ref} id={checkboxId} name={name} type="checkbox" className={cn(styles.checkboxControl, className)} checked={checked} onChange={onChange} disabled={disabled} required={required} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-invalid={error ? "true" : "false"} aria-describedby={describedBy} />
        {(label || helpText) && (
          <span className={styles.checkboxCopy}>
            {label && <span>{label}{required && <span className={styles.required} aria-hidden="true">*</span>}</span>}
            {helpText && !error && <span className={styles.checkboxHelp} id={`${checkboxId}-help`}>{helpText}</span>}
          </span>
        )}
      </label>
      {error && <p className={styles.error} id={`${checkboxId}-error`} role="alert">{error}</p>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;
export { Checkbox };
