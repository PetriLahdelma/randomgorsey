"use client";

import Link from "next/link";
import { useCallback } from "react";
import { usePageTransition } from "./TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

function isInternalPath(href: string): boolean {
  if (href.startsWith("#")) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  return true;
}

/**
 * Drop-in replacement for Next.js Link that triggers the transition system.
 *
 * Behavior:
 * - Internal paths: intercepts click, triggers exit animation, then navigates
 * - External URLs, anchor links, meta/ctrl+click: falls through to default
 * - During active transition: ignores clicks (prevents double-navigation)
 */
export function TransitionLink({
  href,
  children,
  className,
  title,
  onClick,
}: TransitionLinkProps) {
  const { navigate, isTransitioning } = usePageTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let browser handle modifier clicks (new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // Don't intercept external URLs or anchors
      if (!isInternalPath(href)) return;
      // Block during active transition
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      onClick?.();
      navigate(href);
    },
    [href, navigate, isTransitioning, onClick]
  );

  return (
    <Link href={href} className={className} title={title} onClick={handleClick}>
      {children}
    </Link>
  );
}
