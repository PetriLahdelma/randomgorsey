import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./forms/FormField.module.css";

export type GroupLabelProps = {
  children: ReactNode;
  className?: string;
  required?: boolean;
  style?: CSSProperties;
  as?: "div" | "legend";
  description?: ReactNode;
  id?: string;
  descriptionId?: string;
};

const GroupLabel = ({ children, className, required, style, as = "div", description, id, descriptionId }: GroupLabelProps) => {
  const label = <>{children}{required && <span className={styles.required} aria-hidden="true">*</span>}</>;

  if (as === "legend") {
    return (
      <>
        <legend className={cn(styles.groupLabel, className)} style={style} id={id}>{label}</legend>
        {description && <span className={styles.groupDescription} id={descriptionId}>{description}</span>}
      </>
    );
  }

  return (
    <div className={cn(styles.groupLabel, className)} style={style} id={id}>
      {label}
      {description && <span className={styles.groupDescription} id={descriptionId}>{description}</span>}
    </div>
  );
};

export default GroupLabel;
export { GroupLabel };
