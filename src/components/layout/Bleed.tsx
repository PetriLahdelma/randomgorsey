import { createElement } from "react";
import { cn } from "@/lib/utils";
import { type ElementWithChildren } from "@/types/common";

// Note: w-screen can cause horizontal scrollbar when vertical scrollbar is present.
// Alternative: w-dvw (dynamic viewport width) has better behavior but less browser support.
// If scrollbar issues occur, either use w-dvw or add overflow-x: hidden to body.

interface BleedProps {
  /** Component content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Underlying element to render */
  as?: ElementWithChildren;
}

/**
 * Bleed component allows content to break out of contained layouts to full viewport width.
 * Useful for hero images, full-bleed banners, and emphasized sections within contained layouts.
 *
 * @example
 * ```tsx
 * <Container>
 *   <p>Regular contained content</p>
 *   <Bleed>
 *     <img src="hero.jpg" className="w-full" />
 *   </Bleed>
 *   <p>Back to contained content</p>
 * </Container>
 * ```
 */
const Bleed = ({
  children,
  className,
  as: Component = "div",
}: BleedProps) => {
  return createElement(
    Component as React.ElementType,
    {
      className: cn(
        // Full-width breakout technique
        "relative left-1/2 w-screen -translate-x-1/2",
        className
      ),
    },
    children
  );
};

export default Bleed;
export { Bleed };
export type { BleedProps };
