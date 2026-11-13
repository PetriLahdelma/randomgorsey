import { createElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./SystemPrimitives.module.css";
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
  styles.text,
  {
    variants: {
      variant: {
        body: styles.textBody,
        bodySmall: styles.textBodySmall,
        caption: styles.textCaption,
        eyebrow: styles.textEyebrow,
      },
      tone: {
        default: "",
        muted: styles.textMuted,
        contrast: styles.textContrast,
        accent: styles.textAccent,
      },
      align: {
        left: styles.textLeft,
        center: styles.textCenter,
        right: styles.textRight,
      },
      weight: {
        regular: styles.weightRegular,
        medium: styles.weightMedium,
        bold: styles.weightBold,
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
        uppercase && variant !== "eyebrow" && styles.uppercase,
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
