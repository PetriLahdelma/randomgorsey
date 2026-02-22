import React from 'react';
import { usePerformance } from '@/lib/performance';
import { cn } from '@/lib/utils';

/**
 * Props for the VideoBackground component.
 */
export interface VideoBackgroundProps {
  /** Video source URL (WebM preferred) */
  src: string;
  /** Poster image shown on low-tier devices or while loading */
  poster: string;
  /** Optional MP4 fallback for broader compatibility */
  fallbackSrc?: string;
  /** Additional CSS classes */
  className?: string;
  /** Overlay opacity for text readability (0-1) */
  overlayOpacity?: number;
}

/**
 * Full-bleed video background with performance-tiered fallbacks.
 *
 * Rendering behavior based on GPU tier and device:
 * - Tier 0 OR reduced motion: Static poster image only
 * - Tier 1+ AND mobile: Static poster image (battery-conscious)
 * - Tier 1+ AND desktop: Video with poster as fallback
 *
 * @example
 * ```tsx
 * import { VideoBackground } from '@/components/effects';
 * import posterImg from '@/images/hero-poster.jpg';
 * import videoSrc from '@/videos/hero.webm';
 *
 * <VideoBackground
 *   src={videoSrc}
 *   poster={posterImg}
 *   overlayOpacity={0.3}
 * />
 * ```
 */
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  fallbackSrc,
  className,
  overlayOpacity = 0,
}) => {
  const { tier, isMobile, isReducedMotion } = usePerformance();

  // Tier 0, reduced motion, or mobile: static image only
  if (tier === 0 || isReducedMotion || isMobile) {
    return (
      <div className={cn('fixed inset-0 -z-10 h-dvh', className)}>
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          role="img"
          aria-label="Background"
        />
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  // Desktop tier 1+: video with poster fallback
  return (
    <div className={cn('fixed inset-0 -z-10 h-dvh', className)}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/webm" />
        {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      </video>
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default VideoBackground;
