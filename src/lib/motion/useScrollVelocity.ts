"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";
import { frame, cancelFrame } from "framer-motion";
import { getSignalBus } from "@/lib/signal";

/**
 * Returns a MotionValue tracking the current scroll velocity.
 * Updates every frame via SignalBus — no React re-renders.
 */
export function useScrollVelocity() {
  const velocity = useMotionValue(0);
  const bus = getSignalBus();

  useEffect(() => {
    function read() {
      velocity.set(bus.state.scrollVelocity);
    }
    frame.read(read, true);
    return () => cancelFrame(read);
  }, [velocity, bus]);

  return velocity;
}
