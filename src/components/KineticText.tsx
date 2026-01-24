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

  // Split text on mount using SplitType (lines) or manual split (chars/words)
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (splitBy === 'chars' || splitBy === 'words') {
      const tokens =
        splitBy === 'chars'
          ? Array.from(children)
          : children.split(/(\s+)/).filter((token) => token.length > 0);
      setElements(tokens);
      return () => {
        setElements([]);
      };
    }

    if (!containerRef.current) return;

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
  const baseDelay = 0.1;
  const itemVariant: Variants = useMemo(() => {
    const base = variant === 'dramatic' ? textRevealDramatic : textRevealItem;

    const resolveVariant = (
      value: Variants[keyof Variants],
      index: number
    ) => (typeof value === 'function' ? value(index) : value || {});

    return {
      hidden: resolveVariant(base.hidden, 0),
      visible: (index: number) => {
        const resolved = resolveVariant(base.visible, index) as Record<
          string,
          unknown
        >;
        const transition =
          typeof resolved === 'object' &&
          resolved !== null &&
          'transition' in resolved
            ? (resolved as { transition?: Record<string, unknown> }).transition
            : undefined;

        return {
          ...resolved,
          transition: {
            ...(transition ?? {}),
            delay: baseDelay + index * staggerDelay,
          },
        };
      },
    };
  }, [staggerDelay, variant]);

  // Custom container with configurable stagger
  const containerVariant: Variants = useMemo(
    () => ({
      hidden: {},
      visible: {},
    }),
    []
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
        >
          {splitBy === 'chars' && (
            <>
              {(() => {
                type Group =
                  | { type: 'word'; chars: string[] }
                  | { type: 'space'; value: string };
                const groups: Group[] = [];
                let currentWord: string[] = [];

                elements.forEach((char) => {
                  if (char.trim().length === 0) {
                    if (currentWord.length > 0) {
                      groups.push({ type: 'word', chars: currentWord });
                      currentWord = [];
                    }
                    groups.push({ type: 'space', value: char });
                  } else {
                    currentWord.push(char);
                  }
                });

                if (currentWord.length > 0) {
                  groups.push({ type: 'word', chars: currentWord });
                }

                let charIndex = 0;

                return groups.map((group, groupIndex) => {
                  if (group.type === 'space') {
                    return (
                      <span
                        key={`space-${groupIndex}`}
                        aria-hidden="true"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {group.value}
                      </span>
                    );
                  }

                  return (
                    <span
                      key={`word-${groupIndex}`}
                      aria-hidden="true"
                      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                    >
                      {group.chars.map((char, charIndexInWord) => {
                        const index = charIndex++;
                        return (
                          <motion.span
                            key={`char-${groupIndex}-${charIndexInWord}`}
                            variants={itemVariant}
                            custom={index}
                            aria-hidden="true"
                            style={{
                              display: 'inline-block',
                              transformOrigin: needsPerspective
                                ? 'center bottom'
                                : undefined,
                            }}
                          >
                            {char}
                          </motion.span>
                        );
                      })}
                    </span>
                  );
                });
              })()}
            </>
          )}

          {splitBy === 'words' &&
            (() => {
              let wordIndex = 0;
              return elements.map((text, i) => {
                const isWhitespace = text.trim().length === 0;
                if (isWhitespace) {
                  return (
                    <span
                      key={`space-${i}`}
                      aria-hidden="true"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {text}
                    </span>
                  );
                }

                const index = wordIndex++;

                return (
                  <motion.span
                    key={`word-${i}`}
                    variants={itemVariant}
                    custom={index}
                    style={{
                      display: 'inline-block',
                      transformOrigin: needsPerspective
                        ? 'center bottom'
                        : undefined,
                    }}
                    aria-hidden="true"
                  >
                    {text}
                  </motion.span>
                );
              });
            })()}

          {splitBy === 'lines' &&
            elements.map((text, i) => (
              <motion.span
                key={`line-${i}`}
                variants={itemVariant}
                custom={i}
                style={{
                  display: 'block',
                  transformOrigin: needsPerspective ? 'center bottom' : undefined,
                }}
                aria-hidden="true"
              >
                {text}
              </motion.span>
            ))}
        </motion.span>
      )}
    </Tag>
  );
}

export default KineticText;
