/**
 * Signal Bus — Stub Implementation
 *
 * Minimal interface consumed by the transition and scroll systems.
 * Plan 1 (SignalBus + ShaderCanvas) replaces this with the full
 * reactive signal layer and WebGL shader integration.
 */

export interface SignalBusState {
  scrollVelocity: number;
  transition: number;
  pageIntensity: number;
}

export interface SignalBus {
  state: SignalBusState;
  /** Set the transition uniform (0 = calm, 1 = full disruption) */
  setTransition: (value: number) => void;
  /** Set scroll velocity for velocity-driven effects */
  setScrollVelocity: (value: number) => void;
  /** Set page intensity baseline */
  setPageIntensity: (value: number) => void;
}

let instance: SignalBus | null = null;

function createSignalBus(): SignalBus {
  const state: SignalBusState = {
    scrollVelocity: 0,
    transition: 0,
    pageIntensity: 0.3,
  };

  return {
    state,
    setTransition(value: number) {
      state.transition = value;
    },
    setScrollVelocity(value: number) {
      state.scrollVelocity = value;
    },
    setPageIntensity(value: number) {
      state.pageIntensity = value;
    },
  };
}

/** Get the singleton SignalBus instance */
export function getSignalBus(): SignalBus {
  if (!instance) {
    instance = createSignalBus();
  }
  return instance;
}
