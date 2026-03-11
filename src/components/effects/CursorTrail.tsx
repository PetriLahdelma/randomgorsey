"use client";

import React, { useEffect, useRef } from "react";
import { usePerformance } from "@/lib/performance";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const TRAIL_DURATION = 200; // ms
const DOT_RADIUS = 2;
const MAX_ALPHA = 0.4;
// Accent color: #f2e059 -> r:242, g:224, b:89
const ACCENT_R = 242;
const ACCENT_G = 224;
const ACCENT_B = 89;

export function CursorTrail() {
  const { tier, isReducedMotion } = usePerformance();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number | null>(null);
  const isPointerFine =
    typeof window !== "undefined"
      ? window.matchMedia("(pointer: fine)").matches
      : false;

  const shouldRender = tier >= 3 && !isReducedMotion && isPointerFine;

  useEffect(() => {
    if (!shouldRender) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle DPR scaling
    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e: MouseEvent) {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: performance.now(),
      });
    }

    window.addEventListener("mousemove", onMouseMove);

    function draw() {
      if (!canvas || !ctx) return;
      const now = performance.now();

      // Filter out expired points
      pointsRef.current = pointsRef.current.filter(
        (p) => now - p.timestamp < TRAIL_DURATION
      );

      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw dots
      for (const point of pointsRef.current) {
        const age = now - point.timestamp;
        const alpha = MAX_ALPHA * (1 - age / TRAIL_DURATION);
        ctx.beginPath();
        ctx.arc(point.x, point.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    // Pause when tab hidden, clear points on visible
    function onVisibilityChange() {
      if (document.hidden) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        pointsRef.current = [];
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    />
  );
}
