"use client";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { PerformanceProvider } from "@/lib/performance";

export function AnimationProvider({ children, reducedMotion = "user" }: { children: ReactNode; reducedMotion?: "user" | "always" | "never" }) {
  return <PerformanceProvider><MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig></PerformanceProvider>;
}
export default AnimationProvider;
