import { forwardRef } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

type TextAreaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
  cols?: number;
  error?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      placeholder,
      label,
      className,
      rows,
      cols,
      error,
      id,
      disabled = false,
      required = false,
    },
    ref
  ) => {
    const textAreaId =
      id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div
        className={cn("flex flex-col w-full max-w-full", error ? "mb-6" : "mb-4")}
      >
        {label && (
          <label
            className="mb-2 font-europa font-semibold text-primary"
            htmlFor={textAreaId}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textAreaId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full max-w-full box-border py-2 px-3 font-europa text-base",
            "rounded border border-input bg-background resize-both",
            "ring-offset-background transition-colors",
            "placeholder:italic placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          rows={rows}
          cols={cols}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textAreaId}-error` : undefined}
        />
        {error && (
          <div
            className="flex items-center mt-1 text-sm text-destructive"
            id={`${textAreaId}-error`}
          >
            <ExclamationCircleIcon
              className="shrink-0 w-4 h-4 mr-1.5 text-destructive"
              aria-hidden="true"
            />
            <span role="alert">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
export { TextArea };
