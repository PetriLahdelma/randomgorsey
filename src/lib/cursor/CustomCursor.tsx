import { useEffect, useRef } from 'react';
import { motion, useMotionValue, type Variants } from 'framer-motion';

interface CustomCursorProps {
  variant: 'default' | 'hover' | 'text';
}

export function CustomCursor({ variant }: CustomCursorProps) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    const snapDistance = 96;
    const followMin = 0.22;
    const followMax = 0.6;
    const settleThreshold = 0.1;

    const animate = () => {
      const currentX = cursorX.get();
      const currentY = cursorY.get();
      const dx = target.current.x - currentX;
      const dy = target.current.y - currentY;
      const distance = Math.hypot(dx, dy);

      if (distance <= settleThreshold) {
        cursorX.set(target.current.x);
        cursorY.set(target.current.y);
        rafId.current = null;
        return;
      }

      if (distance > snapDistance) {
        // Snap on large jumps to avoid visible lag under fast motion.
        cursorX.set(target.current.x);
        cursorY.set(target.current.y);
      } else {
        const follow = Math.min(
          followMax,
          followMin + distance / (snapDistance * 1.5),
        );
        cursorX.set(currentX + dx * follow);
        cursorY.set(currentY + dy * follow);
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const handlePointerMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      if (!hasMoved.current) {
        cursorX.set(target.current.x);
        cursorY.set(target.current.y);
        hasMoved.current = true;
      }

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [cursorX, cursorY]);

  const variants: Variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      mixBlendMode: 'difference' as const,
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 214, 0, 0.8)', // Brand yellow
      mixBlendMode: 'normal' as const,
    },
    text: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      mixBlendMode: 'difference' as const,
    },
  };

  return (
    <motion.div
      className="custom-cursor fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        willChange: 'transform',
      }}
      variants={variants}
      animate={variant}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  );
}
