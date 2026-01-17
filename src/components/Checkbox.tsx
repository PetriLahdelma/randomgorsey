import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, disabled, className, id }, ref) => {
    const checkboxId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <label
        className={cn(
          "inline-flex items-center gap-2 font-europa cursor-pointer",
          disabled && "cursor-not-allowed opacity-70"
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              "peer relative w-6 h-6 appearance-none cursor-pointer",
              "bg-transparent border-2 border-primary rounded-sm",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "checked:bg-primary",
              "disabled:cursor-not-allowed disabled:border-muted-foreground disabled:bg-transparent",
              "disabled:checked:bg-muted disabled:checked:border-muted-foreground",
              className
            )}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          {/* Checkmark */}
          <svg
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none",
              "text-primary-foreground",
              "opacity-0 peer-checked:opacity-100",
              "transition-opacity"
            )}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3,8 7,12 13,4" />
          </svg>
        </div>
        {label && (
          <span
            className={cn(
              "font-europa text-base font-medium text-primary",
              disabled && "text-muted-foreground"
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
export { Checkbox };
