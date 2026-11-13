import { forwardRef } from "react";

import { cn } from "@/lib/utils";
import styles from "./forms/FormField.module.css";

export type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
};

const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label({ children, htmlFor, className, required, style }, ref) {
  return (
    <label ref={ref} htmlFor={htmlFor} className={cn(styles.label, className)} style={style}>
      {children}
      {required && <span className={styles.required} aria-hidden="true">*</span>}
    </label>
  );
});

Label.displayName = "Label";
export default Label;
export { Label };
