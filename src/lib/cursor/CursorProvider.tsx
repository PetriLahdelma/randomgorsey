import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CustomCursor } from './CustomCursor';

type CursorVariant = 'default' | 'hover' | 'text';

interface CursorContextType {
  cursorVariant: CursorVariant;
  setCursorVariant: (variant: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextType | null>(null);

interface CursorProviderProps {
  children: ReactNode;
}

export function CursorProvider({ children }: CursorProviderProps) {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isDesktop, setIsDesktop] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Check for fine pointer (mouse) + hover capability
    const checkDesktop = () => {
      const query = window.matchMedia('(hover: hover) and (pointer: fine)');
      setIsDesktop(query.matches);
    };

    checkDesktop();

    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    query.addEventListener('change', checkDesktop);
    return () => query.removeEventListener('change', checkDesktop);
  }, []);

  // Add body class for CSS cursor hiding
  useEffect(() => {
    if (isDesktop && !prefersReducedMotion) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }
    return () => document.body.classList.remove('custom-cursor-active');
  }, [isDesktop, prefersReducedMotion]);

  // Don't render custom cursor on touch or reduced motion
  if (!isDesktop || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
      {children}
      <CustomCursor variant={cursorVariant} />
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  // Return no-op if outside provider (touch devices)
  if (!context) {
    return {
      cursorVariant: 'default' as CursorVariant,
      setCursorVariant: () => {},
    };
  }
  return context;
}
