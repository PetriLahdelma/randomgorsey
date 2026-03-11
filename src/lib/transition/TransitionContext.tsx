"use client";

import { createContext, useContext } from "react";

interface TransitionContextValue {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

export const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(TransitionContext);
}
