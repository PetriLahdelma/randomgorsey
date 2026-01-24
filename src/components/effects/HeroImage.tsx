import { Bleed } from "@/components/layout";
import { cn } from "@/lib/utils";

interface HeroImageProps {
  /** Primary image source */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional srcset for responsive images */
  srcSet?: string;
  /** Optional sizes attribute for responsive images */
  sizes?: string;
  /** Height variant: 'half' (50vh), 'full' (100vh), 'auto' */
  height?: "half" | "full" | "auto";
  /** Loading strategy: 'lazy' or 'eager' */
  loading?: "lazy" | "eager";
  /** Object fit: 'cover' (default), 'contain' */
  objectFit?: "cover" | "contain";
  /** Object position (e.g., 'center', 'top', 'bottom') */
  objectPosition?: string;
  /** Additional CSS classes */
  className?: string;
  /** Optional overlay for text readability (0-1) */
  overlayOpacity?: number;
}

const heightClasses = {
  half: "h-[50vh] md:h-[70vh]",
  full: "h-dvh",
  auto: "h-auto",
} as const;

/**
 * HeroImage component renders full-bleed responsive images with proper loading states.
 * Uses Bleed component for viewport-width breakout from contained layouts.
 *
 * @example
 * ```tsx
 * <Container>
 *   <HeroImage
 *     src="/hero.jpg"
 *     alt="Hero banner"
 *     height="half"
 *     srcSet="/hero-640.jpg 640w, /hero-1280.jpg 1280w, /hero-1920.jpg 1920w"
 *     sizes="100vw"
 *     overlayOpacity={0.3}
 *   />
 * </Container>
 * ```
 */
const HeroImage: React.FC<HeroImageProps> = ({
  src,
  alt,
  srcSet,
  sizes,
  height = "half",
  loading = "lazy",
  objectFit = "cover",
  objectPosition = "center",
  className,
  overlayOpacity = 0,
}) => {
  return (
    <Bleed className={cn("relative", heightClasses[height], className)}>
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
        className={cn(
          "h-full w-full",
          objectFit === "cover" ? "object-cover" : "object-contain"
        )}
        style={{ objectPosition }}
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
    </Bleed>
  );
};

export default HeroImage;
export { HeroImage };
export type { HeroImageProps };
