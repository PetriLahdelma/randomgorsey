import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BaseComponentProps } from "../types/common";

type TextVariant = "body" | "bodySmall" | "caption" | "eyebrow";
type TextTone = "default" | "muted" | "contrast" | "accent";
type TextAlign = "left" | "center" | "right";
type TextWeight = "regular" | "medium" | "bold";

const DEFAULT_TEXT_TAG = "p";

/**
 * CVA variant definitions for Text component
 * Maps CSS Module styles to Tailwind utilities
 */
const textVariants = cva(
  // Base classes - always applied
  // Using font-europa utility class for custom font
  "m-0 font-europa leading-[1.6]",
  {
    variants: {
      variant: {
        // 1rem
        body: "text-base",
        // 0.95rem
        bodySmall: "text-[0.95rem]",
        // 0.85rem with letter-spacing 0.02em
        caption: "text-[0.85rem] tracking-[0.02em]",
        // 0.75rem with uppercase and letter-spacing 0.25em
        eyebrow: "text-[0.75rem] uppercase tracking-[0.25em]",
      },
      tone: {
        default: "text-black",
        muted: "text-[#6c757d]", // gray-dark
        contrast: "text-white",
        // Accent uses amber for better contrast - amber-600 on light, amber-300 on dark
        accent: "text-amber-600 dark:text-amber-300",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      weight: {
        regular: "font-normal", // 400
        medium: "font-medium", // 500
        bold: "font-bold", // 700
      },
    },
    defaultVariants: {
      variant: "body",
      tone: "default",
      align: "left",
      weight: "regular",
    },
  }
);

type TextOwnProps = BaseComponentProps & {
  as?: React.ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  align?: TextAlign;
  weight?: TextWeight;
  uppercase?: boolean;
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P> & {
    dateTime?: string;
  };

export type TextProps<
  T extends React.ElementType = typeof DEFAULT_TEXT_TAG,
> = PolymorphicProps<T, TextOwnProps>;

const Text = <T extends React.ElementType = typeof DEFAULT_TEXT_TAG>({
  as,
  variant = "body",
  tone = "default",
  align = "left",
  weight = "regular",
  uppercase = false,
  className,
  style,
  children,
  testId,
  ...rest
}: TextProps<T>) => {
  const Component = (as || DEFAULT_TEXT_TAG) as React.ElementType;

  return (
    <Component
      className={cn(
        textVariants({ variant, tone, align, weight }),
        // Apply uppercase only if not eyebrow (which already has uppercase)
        uppercase && variant !== "eyebrow" && "uppercase",
        className
      )}
      style={style}
      data-testid={testId}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text;
export { textVariants };
