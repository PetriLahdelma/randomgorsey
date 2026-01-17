import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const DEFAULT_ELEMENT = "div";

/**
 * CVA variant definitions for Stack component
 * Arranges children vertically with consistent gap spacing
 */
const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
      section: "gap-16",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
  },
});

type StackOwnProps = {
  /** Underlying element to render */
  as?: React.ElementType;
  /** Gap between children */
  gap?: VariantProps<typeof stackVariants>["gap"];
  /** Cross-axis alignment */
  align?: VariantProps<typeof stackVariants>["align"];
  /** Additional CSS classes */
  className?: string;
  /** Component content */
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type StackProps<
  T extends React.ElementType = typeof DEFAULT_ELEMENT,
> = PolymorphicProps<T, StackOwnProps>;

/**
 * Stack component for vertical layouts with consistent spacing
 *
 * @example
 * ```tsx
 * <Stack gap="lg" align="center">
 *   <h1>Title</h1>
 *   <p>Content paragraph</p>
 *   <Button>Action</Button>
 * </Stack>
 *
 * <Stack as="section" gap="section">
 *   <Header />
 *   <Main />
 *   <Footer />
 * </Stack>
 * ```
 */
const Stack = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  gap = "md",
  align = "stretch",
  className,
  children,
  ...rest
}: StackProps<T>) => {
  const Component = (as || DEFAULT_ELEMENT) as React.ElementType;

  return (
    <Component
      className={cn(stackVariants({ gap, align }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Stack;
export { Stack, stackVariants };
