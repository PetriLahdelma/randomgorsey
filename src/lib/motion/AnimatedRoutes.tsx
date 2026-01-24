/**
 * AnimatedRoutes Component
 *
 * Wraps React Router Routes with AnimatePresence to enable
 * coordinated page exit/enter animations. Uses mode="wait"
 * to ensure the exiting page completes its animation before
 * the entering page starts.
 *
 * @example
 * ```tsx
 * <AnimatedRoutes>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/about" element={<About />} />
 * </AnimatedRoutes>
 * ```
 */

import { AnimatePresence } from 'framer-motion';
import { Routes, useLocation } from 'react-router-dom';

interface AnimatedRoutesProps {
  children: React.ReactNode;
}

export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
}
