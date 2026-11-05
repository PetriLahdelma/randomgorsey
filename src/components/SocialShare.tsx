import React from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./SocialShare.module.css";

export type SocialShareProps = {
  url: string;
  title?: string;
  text?: string;
  className?: string;
};

const SocialShare: React.FC<SocialShareProps> = ({ url, title, text, className }) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const menuId = React.useId();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const copiedTimeout = React.useRef<number | null>(null);

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
    if (!open) return;
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
  }, [open]);

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
        onClick={() => setOpen((current) => !current)}
      >
        {copied ? "Link copied" : "Share"}
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {copied ? "Link copied to clipboard." : ""}
      </span>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={title ? `Share ${title}` : "Share Random Gorsey"}
          className={styles.menu}
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
              <button type="button" role="menuitem" className={styles.menuItem} onClick={handleNativeShare}>
                <Share2 className={styles.icon} aria-hidden="true" />
                <span>Share via device</span>
              </button>
            )}
            <button type="button" role="menuitem" className={styles.menuItem} onClick={handleCopyLink}>
              {copied ? <Check className={styles.icon} aria-hidden="true" /> : <LinkIcon className={styles.icon} aria-hidden="true" />}
              <span>{copied ? "Link copied" : "Copy link"}</span>
            </button>
            <div className={styles.separator} role="separator" />
            {platforms.map((platform) => (
              <a
                key={platform.name}
                role="menuitem"
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                onClick={() => setOpen(false)}
              >
                <span className={styles.platformMarker} aria-hidden="true">↗</span>
                <span>Share on {platform.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
