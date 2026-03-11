"use client";

import { usePerformance } from "@/lib/performance";
import { cn } from "@/lib/utils";

type AmbientVariant =
  | "home"
  | "listen"
  | "contact"
  | "discography"
  | "about"
  | "gallery"
  | "not-found";

interface AmbientLayerProps {
  variant: AmbientVariant;
  className?: string;
}

export function AmbientLayer({ variant, className }: AmbientLayerProps) {
  const { tier, isReducedMotion } = usePerformance();
  if (tier <= 1 || isReducedMotion) return null;

  return (
    <div
      className={cn("fixed inset-0 pointer-events-none z-[1]", className)}
      aria-hidden="true"
    >
      {variant === "not-found" && <NotFoundAmbient />}
      {variant === "contact" && <ContactAmbient />}
      {variant === "discography" && <DiscographyAmbient />}
      {variant === "about" && <AboutAmbient />}
      {variant === "listen" && <ListenAmbient />}
      {/* home and gallery: no extra ambient layer */}
    </div>
  );
}

function NotFoundAmbient() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(100% 0 0deg / 0.03) 2px, transparent 4px)",
      }}
    />
  );
}

function ContactAmbient() {
  return (
    <div className="absolute inset-8 md:inset-16 lg:inset-24">
      <div className="absolute inset-0 border border-[oklch(15%_0_0deg)] overflow-hidden">
        <div
          className="absolute w-[4px] h-[4px] bg-[color:var(--color-accent)] rounded-full"
          style={{ animation: "border-travel 8s linear infinite" }}
        />
      </div>
    </div>
  );
}

function DiscographyAmbient() {
  return (
    <div className="absolute inset-0">
      {[20, 40, 60, 80].map((pct) => (
        <div
          key={pct}
          className="absolute left-0 right-0 h-[1px] bg-[oklch(20%_0_0deg)]"
          style={{ top: `${pct}%` }}
        />
      ))}
    </div>
  );
}

function AboutAmbient() {
  return (
    <>
      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, oklch(0% 0 0deg / 0.4) 100%)",
        }}
      />
      {/* Hot pixel — random blink */}
      <div
        className="absolute w-[1px] h-[1px] bg-[color:var(--color-accent)]"
        style={{
          top: "37%",
          left: "73%",
          animation: "hot-pixel 3s steps(1) infinite",
        }}
      />
    </>
  );
}

function ListenAmbient() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(100% 0 0deg / 0.2) 3px, transparent 6px)",
      }}
    />
  );
}
