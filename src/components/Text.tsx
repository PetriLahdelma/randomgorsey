import { createElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  BaseComponentProps,
  type ElementWithChildren,
  type PolymorphicProps,
} from "../types/common";

type TextVariant = "body" | "bodySmall" | "caption" | "eyebrow";
type TextTone = "default" | "muted" | "contrast" | "accent";
type TextAlign = "left" | "center" | "right";
type TextWeight = "regular" | "medium" | "bold";

const DEFAULT_TEXT_TAG = "p";

/**
 * Text component with fluid typography
 * Uses typography tokens from src/styles/tokens/typography.css
 * All variants scale fluidly between mobile and desktop viewports
 */
const textVariants = cva(
  // Base classes - always applied
  // Using font-europa utility class for custom font
  "m-0 font-europa",
  {
    variants: {
      variant: {
        // Maps to --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
        body: "text-base",
        // Maps to --text-sm: clamp(0.8rem, 0.75rem + 0.25vw, 1rem)
        bodySmall: "text-sm",
        // Maps to --text-xs: clamp(0.64rem, 0.6rem + 0.2vw, 0.8rem)
        // Keep tracking-[0.02em] for caption styling
        caption: "text-xs tracking-[0.02em]",
        // Keep text-xs with uppercase and wider tracking for eyebrow
        eyebrow: "text-xs uppercase tracking-[0.25em]",
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
  variant?: TextVariant;
  tone?: TextTone;
  align?: TextAlign;
  weight?: TextWeight;
  uppercase?: boolean;
  dateTime?: string;
};

export type TextProps<
  T extends ElementWithChildren = typeof DEFAULT_TEXT_TAG,
> = PolymorphicProps<T, TextOwnProps>;

const Text = <T extends ElementWithChildren = typeof DEFAULT_TEXT_TAG>({
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
  const Component = (as || DEFAULT_TEXT_TAG) as T;

  return createElement(
    Component as React.ElementType,
    {
      className: cn(
        textVariants({ variant, tone, align, weight }),
        // Apply uppercase only if not eyebrow (which already has uppercase)
        uppercase && variant !== "eyebrow" && "uppercase",
        className
      ),
      style,
      "data-testid": testId,
      ...rest,
    },
    children
  );
};

export default Text;
export { textVariants };
