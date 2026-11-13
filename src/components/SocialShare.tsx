import React from "react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./SocialShare.module.css";

export type SocialShareProps = {
  url: string;
  title?: string;
  text?: string;
  className?: string;
};

type RevealOrigin = { x: number; y: number };

type ShareMenuShellProps = {
  children: React.ReactNode;
  label: string;
  menuId: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  motionAllowed: boolean;
  origin: RevealOrigin | null;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
};

function ShareMenuShell({
  children,
  label,
  menuId,
  menuRef,
  motionAllowed,
  origin,
  onKeyDown,
}: ShareMenuShellProps) {
  const isPresent = useIsPresent();
  const [animating, setAnimating] = React.useState(false);
  const measured = origin !== null;
  const x = origin?.x ?? 0;
  const y = origin?.y ?? 0;

  const motionState: Pick<MotionProps, "initial" | "animate" | "exit"> = motionAllowed
    ? {
        initial: { opacity: 0, scale: 0.95, clipPath: `circle(0 at ${x}px ${y}px)` },
        animate: measured
          ? {
              opacity: 1,
              scale: 1,
              clipPath: `circle(150vmax at ${x}px ${y}px)`,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }
          : { opacity: 0, scale: 0.95, clipPath: `circle(0 at ${x}px ${y}px)` },
        exit: {
          opacity: 0,
          scale: 0.95,
          clipPath: `circle(0 at ${x}px ${y}px)`,
          transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
        },
      }
    : {
        initial: false,
        animate: { opacity: 1, scale: 1, clipPath: "none" },
        exit: { opacity: 1, scale: 1, clipPath: "none", transition: { duration: 0 } },
      };

  return (
    <motion.div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={label}
      aria-hidden={!isPresent || undefined}
      inert={!isPresent || undefined}
      className={styles.menu}
      style={{
        transformOrigin: `${x}px ${y}px`,
        visibility: measured || !motionAllowed ? "visible" : "hidden",
        willChange: animating && motionAllowed ? "clip-path, opacity, transform" : "auto",
      }}
      data-motion={motionAllowed ? "animated" : "instant"}
      data-origin-ready={measured || undefined}
      onKeyDown={onKeyDown}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
      {...motionState}
    >
      {children}
    </motion.div>
  );
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, text, className }) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [motionAllowed, setMotionAllowed] = React.useState(false);
  const [revealOrigin, setRevealOrigin] = React.useState<RevealOrigin | null>(null);
  const menuId = React.useId();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const copiedTimeout = React.useRef<number | null>(null);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const sync = () => setMotionAllowed(!reducedMotion.matches && !coarsePointer.matches);

    sync();
    reducedMotion.addEventListener("change", sync);
    coarsePointer.addEventListener("change", sync);
    return () => {
      reducedMotion.removeEventListener("change", sync);
      coarsePointer.removeEventListener("change", sync);
    };
  }, []);

  const shareText = text || title || "Check this out on Random Gorsey!";
  const shareUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const platforms = [
    { name: "X (Twitter)", url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodedText}` },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { name: "Reddit", url: `https://www.reddit.com/submit?url=${shareUrl}&title=${encodedText}` },
    { name: "WhatsApp", url: `https://wa.me/?text=${encodedText}%20${shareUrl}` },
    { name: "Telegram", url: `https://t.me/share/url?url=${shareUrl}&text=${encodedText}` },
  ];

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const closeAndFocusTrigger = React.useCallback(() => {
    triggerRef.current?.focus();
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (!open || (motionAllowed && !revealOrigin)) return;
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [motionAllowed, open, revealOrigin]);

  const measureOrigin = React.useCallback(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    setRevealOrigin({
      x: triggerRect.left + triggerRect.width / 2 - menuRef.current.offsetLeft,
      y: triggerRect.top + triggerRect.height / 2 - menuRef.current.offsetTop,
    });
  }, [open]);

  React.useLayoutEffect(measureOrigin, [measureOrigin]);

  React.useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measureOrigin);
    window.addEventListener("scroll", measureOrigin, { passive: true });
    return () => {
      window.removeEventListener("resize", measureOrigin);
      window.removeEventListener("scroll", measureOrigin);
    };
  }, [measureOrigin, open]);

  React.useEffect(
    () => () => {
      if (copiedTimeout.current !== null) window.clearTimeout(copiedTimeout.current);
    },
    []
  );

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusTrigger();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
    if (items.length === 0) return;
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? (currentIndex + 1 + items.length) % items.length
            : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && containerRef.current?.contains(nextTarget)) return;
    setOpen(false);
  };

  const toggleMenu = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setRevealOrigin(null);
    setOpen(true);
  };

  const rowMotion = motionAllowed
    ? {
        hidden: { opacity: 0, y: 4 },
        visible: (index: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: Math.min(index, 5) * 0.03,
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        }),
      }
    : { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({ title: title || "Random Gorsey", text: shareText, url });
    } catch {
      // Cancelling the native sheet leaves the page unchanged.
    } finally {
      closeAndFocusTrigger();
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        if (copiedTimeout.current !== null) window.clearTimeout(copiedTimeout.current);
        copiedTimeout.current = window.setTimeout(() => setCopied(false), 2000);
      } else {
        window.prompt("Copy link", url);
      }
    } catch {
      window.prompt("Copy link", url);
    } finally {
      closeAndFocusTrigger();
    }
  };

  return (
    <div ref={containerRef} className={cn(styles.root, className)} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label="Share"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={toggleMenu}
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "copied" : "share"}
              initial={motionAllowed ? { opacity: 0, scale: 0.8, filter: "blur(3px)" } : false}
              animate={copied && motionAllowed
                ? { opacity: 1, scale: [1, 1.12, 1], filter: "blur(0px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={motionAllowed ? { opacity: 0, scale: 0.8, filter: "blur(3px)" } : undefined}
              transition={{ duration: motionAllowed ? 0.16 : 0, ease: [0.16, 1, 0.3, 1] }}
            >
              {copied ? <Check /> : <Share2 />}
            </motion.span>
          </AnimatePresence>
        </span>
        <span>{copied ? "Link copied" : "Share"}</span>
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {copied ? "Link copied to clipboard." : ""}
      </span>

      <AnimatePresence initial={false} onExitComplete={() => setRevealOrigin(null)}>
        {open && (
        <ShareMenuShell
          menuRef={menuRef}
          menuId={menuId}
          label={title ? `Share ${title}` : "Share Random Gorsey"}
          motionAllowed={motionAllowed}
          origin={revealOrigin}
          onKeyDown={handleMenuKeyDown}
        >
          <div className={styles.titleBar}>
            <span className={styles.windowIcon} aria-hidden="true" />
            <span className={styles.title}>SHARE.EXE</span>
            <button
              type="button"
              role="menuitem"
              className={styles.closeButton}
              aria-label="Close share menu"
              onClick={closeAndFocusTrigger}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className={styles.menuBody}>
            {canNativeShare && (
              <motion.button custom={0} initial="hidden" animate="visible" variants={rowMotion} type="button" role="menuitem" className={styles.menuItem} onClick={handleNativeShare}>
                <Share2 className={styles.icon} aria-hidden="true" />
                <span>Share via device</span>
              </motion.button>
            )}
            <motion.button custom={canNativeShare ? 1 : 0} initial="hidden" animate="visible" variants={rowMotion} type="button" role="menuitem" className={styles.menuItem} onClick={handleCopyLink}>
              {copied ? <Check className={styles.icon} aria-hidden="true" /> : <LinkIcon className={styles.icon} aria-hidden="true" />}
              <span>{copied ? "Link copied" : "Copy link"}</span>
            </motion.button>
            <div className={styles.separator} role="separator" />
            {platforms.map((platform, index) => (
              <motion.a
                key={platform.name}
                custom={index + (canNativeShare ? 2 : 1)}
                initial="hidden"
                animate="visible"
                variants={rowMotion}
                role="menuitem"
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                onClick={() => setOpen(false)}
              >
                <span className={styles.platformMarker} aria-hidden="true">↗</span>
                <span>Share on {platform.name}</span>
              </motion.a>
            ))}
          </div>
        </ShareMenuShell>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
