import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const DEFAULT_ELEMENT = "div";

/**
 * CVA variant definitions for Container component
 * Max-width content constraint with horizontal padding
 */
const containerVariants = cva(
  // Base classes - centered container with full width
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm", // 640px
        md: "max-w-screen-md", // 768px
        lg: "max-w-screen-lg", // 1024px
        xl: "max-w-screen-xl", // 1280px
        "2xl": "max-w-screen-2xl", // 1536px
        prose: "max-w-prose", // ~65ch, good for reading
        full: "max-w-full", // no constraint
      },
      padding: {
        none: "px-0",
        sm: "px-4", // 1rem
        md: "px-6", // 1.5rem
        lg: "px-8", // 2rem
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "md",
    },
  }
);

type ContainerOwnProps = {
  /** Underlying element to render */
  as?: React.ElementType;
  /** Maximum width constraint */
  size?: VariantProps<typeof containerVariants>["size"];
  /** Horizontal padding */
  padding?: VariantProps<typeof containerVariants>["padding"];
  /** Additional CSS classes */
  className?: string;
  /** Component content */
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type ContainerProps<
  T extends React.ElementType = typeof DEFAULT_ELEMENT,
> = PolymorphicProps<T, ContainerOwnProps>;

/**
 * Container component for constraining content width with consistent padding.
 * Provides max-width constraints that center content horizontally.
 *
 * @example
 * ```tsx
 * // Default container (xl width, md padding)
 * <Container>
 *   <h1>Page Title</h1>
 *   <p>Content goes here...</p>
 * </Container>
 *
 * // Narrow container for reading (prose width)
 * <Container size="prose">
 *   <article>Long form content...</article>
 * </Container>
 *
 * // Full-width container with large padding
 * <Container size="full" padding="lg">
 *   <nav>Full-width navigation</nav>
 * </Container>
 *
 * // Semantic main element
 * <Container as="main" size="lg">
 *   <section>Main content</section>
 * </Container>
 * ```
 */
const Container = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  size = "xl",
  padding = "md",
  className,
  children,
  ...rest
}: ContainerProps<T>) => {
  const Component = (as || DEFAULT_ELEMENT) as React.ElementType;

  return (
    <Component
      className={cn(containerVariants({ size, padding }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Container;
export { Container, containerVariants };
