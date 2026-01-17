import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';

interface CustomCursorProps {
  variant: 'default' | 'hover' | 'text';
}

export function CustomCursor({ variant }: CustomCursorProps) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring config for smooth, slightly elastic following
  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      variants={variants}
      animate={variant}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  );
}
