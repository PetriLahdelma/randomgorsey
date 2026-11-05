import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PerformanceContext } from './gpu-tier';

interface ConnectionWithSaveData extends EventTarget {
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: ConnectionWithSaveData;
}

export interface PerformanceContextValue extends PerformanceContext {
  effectsEnabled: boolean;
}

const INITIAL_PERFORMANCE: PerformanceContext = {
  tier: 0,
  isMobile: false,
  isReducedMotion: false,
  canWebGL: false,
};

/**
 * React context for performance tier information.
 * Null when accessed outside PerformanceProvider.
 */
const PerfCtx = createContext<PerformanceContextValue | null>(null);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that detects GPU tier and shares performance context app-wide.
 *
 * Reconciles browser preferences without triggering GPU benchmarking:
 * - Coarse pointer/mobile input mode
 * - prefers-reduced-motion preference
 * - reduced-data preference when exposed by the browser
 *
 * The server and first client render are deliberately conservative. Effects
 * remain off until client preferences have reconciled. Hardware stays unknown;
 * optional GPU consumers must request capability only when they actually need it.
 *
 * @example
 * ```tsx
 * <PerformanceProvider>
 *   <App />
 * </PerformanceProvider>
 * ```
 */
export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  const [perf, setPerf] = useState<PerformanceContext>(INITIAL_PERFORMANCE);
  const [saveData, setSaveData] = useState(false);
  const [preferencesResolved, setPreferencesResolved] = useState(false);

  useEffect(() => {
    let active = true;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const connection = (navigator as NavigatorWithConnection).connection;

    const updateConnection = () => setSaveData(Boolean(connection?.saveData));
    const updatePreferences = () => {
      setPerf((current) => ({
        ...current,
        isMobile: pointerQuery.matches,
        isReducedMotion: motionQuery.matches,
      }));
    };

    queueMicrotask(() => {
      if (!active) return;
      updateConnection();
      updatePreferences();
      setPreferencesResolved(true);
    });
    motionQuery.addEventListener('change', updatePreferences);
    pointerQuery.addEventListener('change', updatePreferences);
    connection?.addEventListener('change', updateConnection);

    return () => {
      active = false;
      motionQuery.removeEventListener('change', updatePreferences);
      pointerQuery.removeEventListener('change', updatePreferences);
      connection?.removeEventListener('change', updateConnection);
    };
  }, []);

  const value = useMemo<PerformanceContextValue>(
    () => ({
      ...perf,
      effectsEnabled:
        preferencesResolved &&
        !perf.isReducedMotion &&
        !saveData,
    }),
    [perf, preferencesResolved, saveData]
  );

  return <PerfCtx.Provider value={value}>{children}</PerfCtx.Provider>;
};

/**
 * Hook to access performance tier information.
 *
 * Must be used within PerformanceProvider.
 *
 * @returns Conservative hardware state plus the automatic motion policy
 * @throws Error if used outside PerformanceProvider
 *
 * @example
 * ```tsx
 * const { tier, isReducedMotion } = usePerformance();
 *
 * if (tier === 0 || isReducedMotion) {
 *   return <StaticImage />;
 * }
 * return <AnimatedVideo />;
 * ```
 */
export const usePerformance = (): PerformanceContextValue => {
  const ctx = useContext(PerfCtx);
  if (!ctx) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return ctx;
};
