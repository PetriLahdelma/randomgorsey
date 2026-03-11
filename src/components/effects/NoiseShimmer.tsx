"use client";

import { cn } from "@/lib/utils";

interface NoiseShimmerProps {
  className?: string;
  loaded?: boolean;
}

export function NoiseShimmer({ className, loaded = false }: NoiseShimmerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden transition-opacity duration-200",
        loaded && "opacity-0 pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <div className="absolute left-0 right-0 h-[2px] bg-[oklch(40%_0_0deg)] animate-shimmer-scan" />
    </div>
  );
}
