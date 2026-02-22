import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
};

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, htmlFor, className, required, style }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "inline-block mb-1 font-europa text-base font-bold text-primary",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      style={style}
    >
      {children}
      {required && (
        <span className="ml-1 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
);

Label.displayName = "Label";

export default Label;
export { Label };
