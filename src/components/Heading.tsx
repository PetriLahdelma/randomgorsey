import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BaseComponentProps } from "../types/common";

type HeadingTone = "light" | "dark" | "accent";
type HeadingAlign = "left" | "center" | "right";
type HeadingWeight = "regular" | "medium" | "bold";

const DEFAULT_HEADING_TAG = "h2";

/**
 * Heading component with fluid typography
 * Uses typography tokens from src/styles/tokens/typography.css
 * Each level maps to a fluid clamp() value that scales smoothly
 * between mobile (400px) and desktop (1280px) viewports
 */
const headingVariants = cva(
  // Base classes - always applied
  // Using font-tschick-bold utility class for custom font
  // break-words ensures long words break on mobile to prevent horizontal scroll
  "m-0 font-tschick-bold tracking-[0.08em] break-words",
  {
    variants: {
      level: {
        // Maps to --text-6xl: clamp(2.281rem, 1.85rem + 2.16vw, 4.032rem)
        1: "text-6xl",
        // Maps to --text-5xl: clamp(2.027rem, 1.69rem + 1.69vw, 3.36rem)
        2: "text-5xl",
        // Maps to --text-4xl: clamp(1.802rem, 1.54rem + 1.31vw, 2.8rem)
        3: "text-4xl",
        // Maps to --text-3xl: clamp(1.602rem, 1.4rem + 1.01vw, 2.333rem)
        4: "text-3xl",
        // Maps to --text-2xl: clamp(1.424rem, 1.27rem + 0.77vw, 1.944rem)
        5: "text-2xl",
        // Maps to --text-xl: clamp(1.266rem, 1.15rem + 0.58vw, 1.62rem)
        6: "text-xl",
      },
      tone: {
        light: "text-white",
        dark: "text-black",
        // Accent uses fuchsia-500 for magenta-like color with better contrast
        accent: "text-fuchsia-500",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      weight: {
        regular: "font-normal", // 400
        medium: "font-semibold", // 600
        bold: "font-bold", // 700
      },
    },
    defaultVariants: {
      level: 2,
      tone: "dark",
      align: "left",
      weight: "bold",
    },
  }
);

type HeadingOwnProps = BaseComponentProps & {
  /** HTML tag to render */
  as?: React.ElementType;
  /** Visual level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Tone determines text color */
  tone?: HeadingTone;
  /** Text alignment */
  align?: HeadingAlign;
  /** Weight overrides */
  weight?: HeadingWeight;
  /** Force uppercase (default true) */
  uppercase?: boolean;
  /** Heading content */
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type HeadingProps<
  T extends React.ElementType = typeof DEFAULT_HEADING_TAG,
> = PolymorphicProps<T, HeadingOwnProps>;

const Heading = <T extends React.ElementType = typeof DEFAULT_HEADING_TAG>({
  as,
  level = 2,
  tone = "dark",
  align = "left",
  weight = "bold",
  uppercase = true,
  className,
  style,
  children,
  testId,
  ...rest
}: HeadingProps<T>) => {
  const Component =
    (as as React.ElementType) || (`h${level}` as React.ElementType);

  return (
    <Component
      className={cn(
        headingVariants({ level, tone, align, weight }),
        uppercase && "uppercase",
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

export default Heading;
export { headingVariants };
