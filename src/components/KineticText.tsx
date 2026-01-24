/**
 * KineticText Component
 *
 * Animates text character-by-character or word-by-word using SplitType
 * and Framer Motion. Creates cinematic text reveal effects for headings
 * and impactful copy.
 *
 * @example
 * ```tsx
 * <KineticText as="h1" splitBy="chars">
 *   Welcome to Random Gorsey
 * </KineticText>
 * ```
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion, useInView, type Variants } from 'framer-motion';
import SplitType from 'split-type';
import { cn } from '@/lib/utils';
import { textRevealItem, textRevealDramatic } from '@/lib/motion';

type SplitMode = 'chars' | 'words' | 'lines';
type AnimationVariant = 'default' | 'dramatic';

interface KineticTextProps {
  /** Text content to animate */
  children: string;
  /** HTML element to render */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  /** How to split the text */
  splitBy?: SplitMode;
  /** Delay between each character/word (seconds) */
  staggerDelay?: number;
  /** Animation style */
  variant?: AnimationVariant;
  /** Trigger animation when scrolled into view */
  triggerOnView?: boolean;
  /** Viewport amount required to trigger (0-1) */
  viewportAmount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * KineticText - Animated text reveal component
 *
 * Uses SplitType to split text into characters, words, or lines,
 * then animates each piece with staggered Framer Motion animations.
 *
 * Accessibility:
 * - Full text is announced via aria-label on container
 * - Split elements are aria-hidden to prevent character-by-character reading
 * - Reduced motion preference shows static text immediately
 */
export function KineticText({
  children,
  as: Tag = 'span',
  splitBy = 'chars',
  staggerDelay = 0.03,
  variant = 'default',
  triggerOnView = true,
  viewportAmount = 0.5,
  className,
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [elements, setElements] = useState<string[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, {
    once: true,
    amount: viewportAmount,
  });

  // Split text on mount using SplitType
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    // Create a temporary element to split the text
    const tempEl = document.createElement('span');
    tempEl.textContent = children;
    containerRef.current.appendChild(tempEl);

    // Split the text
    const split = new SplitType(tempEl, {
      types: splitBy,
      tagName: 'span',
    });

    // Extract the split content
    const splitElements = split[splitBy] || [];
    const textContent = splitElements.map((el) => el.textContent || '');

    // Store the text content
    setElements(textContent);

    // Clean up the temporary element
    split.revert();
    if (containerRef.current.contains(tempEl)) {
      containerRef.current.removeChild(tempEl);
    }

    return () => {
      setElements([]);
    };
  }, [children, splitBy, prefersReducedMotion]);

  // Reduced motion: render static text immediately
  if (prefersReducedMotion) {
    return (
      <Tag className={className} aria-label={children}>
        {children}
      </Tag>
    );
  }

  const shouldAnimate = triggerOnView ? isInView : true;

  // Select item variant based on prop
  const itemVariant: Variants =
    variant === 'dramatic' ? textRevealDramatic : textRevealItem;

  // Custom container with configurable stagger
  const containerVariant: Variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    }),
    [staggerDelay]
  );

  // Determine if we need perspective for 3D rotateX effect
  const needsPerspective = variant === 'dramatic';

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLElement>}
      className={cn('kinetic-text', className)}
      aria-label={children}
      style={{
        perspective: needsPerspective ? '1000px' : undefined,
      }}
    >
      {elements.length === 0 ? (
        // Show text until split completes (prevents flash)
        <span style={{ visibility: 'hidden' }}>{children}</span>
      ) : (
        <motion.span
          variants={containerVariant}
          initial="hidden"
          animate={shouldAnimate ? 'visible' : 'hidden'}
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'inherit',
          }}
        >
          {elements.map((text, i) => (
            <motion.span
              key={i}
              variants={itemVariant}
              style={{
                display: 'inline-block',
                whiteSpace: text === ' ' ? 'pre' : 'normal',
                transformOrigin: needsPerspective ? 'center bottom' : undefined,
              }}
              aria-hidden="true"
            >
              {text === ' ' ? '\u00A0' : text}
            </motion.span>
          ))}
        </motion.span>
      )}
    </Tag>
  );
}

export default KineticText;
