"use client";

import { usePathname } from "next/navigation";
import React from "react";

import {
  playerDetails,
  type EmbedProvider,
} from "@/components/player/player-config";

import styles from "./PersistentPlayer.module.css";

type EmbedStatus = "idle" | "loading" | "ready" | "timed-out";
type Presentation = "expanded" | "compact";

interface PlayerContextValue {
  activeProvider: EmbedProvider | null;
  status: EmbedStatus;
  presentation: Presentation;
  loadProvider: (provider: EmbedProvider, trigger?: HTMLElement) => void;
  minimize: () => void;
  expand: () => void;
  close: () => void;
}

const PlayerContext = React.createContext<PlayerContextValue | null>(null);

export function usePersistentPlayer(): PlayerContextValue {
  const value = React.useContext(PlayerContext);
  if (!value) throw new Error("usePersistentPlayer must be used inside PlayerProvider");
  return value;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const previousPath = React.useRef(pathname);
  const sourceTrigger = React.useRef<HTMLElement | null>(null);
  const automaticallyCompacted = React.useRef(false);
  const deliberatelyMinimized = React.useRef(false);
  const [activeProvider, setActiveProvider] = React.useState<EmbedProvider | null>(null);
  const [status, setStatus] = React.useState<EmbedStatus>("idle");
  const [presentation, setPresentation] = React.useState<Presentation>("expanded");
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    if (!activeProvider || status !== "loading") return;
    const timeout = window.setTimeout(() => setStatus("timed-out"), 12_000);
    return () => window.clearTimeout(timeout);
  }, [activeProvider, status]);

  React.useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (!activeProvider) return;
    if (pathname === "/listen/") {
      if (!automaticallyCompacted.current || deliberatelyMinimized.current) return;
      const timeout = window.setTimeout(() => {
        automaticallyCompacted.current = false;
        setPresentation("expanded");
        setAnnouncement(`${playerDetails[activeProvider].label} player returned to the listening console.`);
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    if (deliberatelyMinimized.current) return;
    const timeout = window.setTimeout(() => {
      automaticallyCompacted.current = true;
      setPresentation("compact");
      setAnnouncement(`${playerDetails[activeProvider].label} player minimized.`);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [activeProvider, pathname]);

  const loadProvider = React.useCallback((provider: EmbedProvider, trigger?: HTMLElement) => {
    if (trigger) sourceTrigger.current = trigger;
    if (provider === activeProvider) {
      deliberatelyMinimized.current = false;
      automaticallyCompacted.current = false;
      setPresentation("expanded");
      setAnnouncement(`${playerDetails[provider].label} player expanded.`);
      return;
    }
    setActiveProvider(provider);
    deliberatelyMinimized.current = false;
    automaticallyCompacted.current = false;
    setStatus("loading");
    setPresentation("expanded");
    setAnnouncement(`${playerDetails[provider].label} player opened.`);
  }, [activeProvider]);

  const minimize = React.useCallback(() => {
    if (!activeProvider) return;
    deliberatelyMinimized.current = true;
    automaticallyCompacted.current = false;
    setPresentation("compact");
    setAnnouncement(`${playerDetails[activeProvider].label} player minimized.`);
  }, [activeProvider]);

  const expand = React.useCallback(() => {
    if (!activeProvider) return;
    deliberatelyMinimized.current = false;
    automaticallyCompacted.current = false;
    setPresentation("expanded");
    setAnnouncement(`${playerDetails[activeProvider].label} player expanded.`);
  }, [activeProvider]);

  const close = React.useCallback(() => {
    setActiveProvider(null);
    deliberatelyMinimized.current = false;
    automaticallyCompacted.current = false;
    setStatus("idle");
    setPresentation("expanded");
    setAnnouncement("Player closed; playback stopped.");
    window.requestAnimationFrame(() => {
      if (sourceTrigger.current?.isConnected) sourceTrigger.current.focus();
      else document.getElementById("main-content")?.focus({ preventScroll: true });
    });
  }, []);

  const value = React.useMemo(
    () => ({ activeProvider, status, presentation, loadProvider, minimize, expand, close }),
    [activeProvider, status, presentation, loadProvider, minimize, expand, close]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <PersistentPlayer
        activeProvider={activeProvider}
        status={status}
        presentation={presentation}
        pathname={pathname}
        onReady={() => setStatus("ready")}
        onMinimize={minimize}
        onExpand={expand}
        onClose={close}
      />
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </PlayerContext.Provider>
  );
}

interface PersistentPlayerProps {
  activeProvider: EmbedProvider | null;
  status: EmbedStatus;
  presentation: Presentation;
  pathname: string;
  onReady: () => void;
  onMinimize: () => void;
  onExpand: () => void;
  onClose: () => void;
}

function PersistentPlayer({
  activeProvider,
  status,
  presentation,
  pathname,
  onReady,
  onMinimize,
  onExpand,
  onClose,
}: PersistentPlayerProps) {
  const frameRef = React.useRef<HTMLDivElement | null>(null);
  const compactExpandRef = React.useRef<HTMLButtonElement | null>(null);
  const expandedMinimizeRef = React.useRef<HTMLButtonElement | null>(null);
  const focusAfterChange = React.useRef<"expand" | "minimize" | null>(null);

  React.useLayoutEffect(() => {
    const target = focusAfterChange.current;
    if (!target) return;
    focusAfterChange.current = null;
    const animationFrame = requestAnimationFrame(() => {
      if (target === "expand") compactExpandRef.current?.focus();
      else expandedMinimizeRef.current?.focus();
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [presentation]);

  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !activeProvider || presentation !== "expanded" || pathname !== "/listen/") return;
    const anchor = document.querySelector<HTMLElement>("[data-player-anchor]");
    if (!anchor) return;

    let animationFrame = 0;
    const place = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const rect = anchor.getBoundingClientRect();
        frame.style.setProperty("--player-anchor-top", `${rect.top}px`);
        frame.style.setProperty("--player-anchor-left", `${rect.left}px`);
        frame.style.setProperty("--player-anchor-width", `${rect.width}px`);
      });
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    observer?.observe(anchor);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    place();
    return () => {
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [activeProvider, pathname, presentation]);

  if (!activeProvider) return null;
  const detail = playerDetails[activeProvider];
  const alignedToListen = pathname === "/listen/" && presentation === "expanded";
  const className = [
    styles.player,
    presentation === "compact" ? styles.compact : styles.expanded,
    alignedToListen ? styles.listenAligned : "",
  ].filter(Boolean).join(" ");

  const actions = presentation === "compact" ? (
    <>
      <button ref={compactExpandRef} type="button" aria-label="Expand player" title="Expand player" onClick={() => { focusAfterChange.current = "minimize"; onExpand(); }}><span aria-hidden="true">□</span></button>
      <button type="button" aria-label="Close player" title="Close player" onClick={onClose}><span aria-hidden="true">×</span></button>
    </>
  ) : (
    <>
      <button ref={expandedMinimizeRef} type="button" aria-label="Minimize player" title="Minimize player" onClick={() => { focusAfterChange.current = "expand"; onMinimize(); }}><span aria-hidden="true">—</span></button>
      <button type="button" aria-label="Close player" title="Close player" onClick={onClose}><span aria-hidden="true">×</span></button>
    </>
  );

  return (
    <section
      ref={frameRef}
      className={className}
      data-persistent-player
      data-provider={activeProvider}
      aria-label={`${detail.label} sitewide player`}
      style={{ "--player-frame-height": `${detail.frameHeight}px` } as React.CSSProperties}
    >
      <div className={styles.playerHeader}>
        <span className={styles.windowIcon} aria-hidden="true" />
        <span className={styles.playerTitle}>{presentation === "compact" ? detail.label : `${detail.label} / external player`}</span>
        <div className={styles.playerActions}>{actions}</div>
      </div>
      <div className={styles.playerBody}>
        <div className={styles.playerWell} inert={presentation === "compact"} aria-hidden={presentation === "compact"}>
          {status === "loading" && <p className={styles.status} role="status">Connecting to {detail.label}…</p>}
          {status === "timed-out" && (
            <div className={styles.timeout} role="alert">
              <p>The player is taking longer than expected.</p>
              <a href={detail.directHref} target="_blank" rel="noopener noreferrer">Open {detail.label} directly</a>
            </div>
          )}
          <div
            className={`${styles.embedViewport} ${activeProvider === "spotify" ? "studioPlayerViewport studioSquarePlayer" : "studioPlayerViewport"}`}
            style={{ "--player-height": `${detail.height}px` } as React.CSSProperties}
          >
            <iframe
              key={activeProvider}
              title={detail.title}
              src={detail.src}
              width="100%"
              height={detail.height}
              allow={detail.allow}
              allowFullScreen={activeProvider === "spotify"}
              tabIndex={presentation === "compact" ? -1 : 0}
              className={styles.embed}
              onLoad={onReady}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
