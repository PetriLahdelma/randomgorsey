"use client";

import React from "react";

import { SignalArtwork } from "@/components/studio/SignalArtwork";
import { StudioWindow } from "@/components/studio/StudioWindow";
import {
  platformLinks,
  soundcloudEmbedUrl,
  soundcloudPlaylistUrl,
  spotifyEmbedUrl,
  type PlatformId,
} from "@/content/platforms";

import styles from "./Listen.module.css";

type EmbedProvider = Extract<PlatformId, "spotify" | "soundcloud">;
type EmbedStatus = "idle" | "loading" | "ready" | "timed-out";

const embedDetails: Record<
  EmbedProvider,
  { label: string; src: string; title: string; height: number; directHref: string; allow: string }
> = {
  spotify: {
    label: "Spotify",
    src: spotifyEmbedUrl,
    title: "Spotify player",
    height: 352,
    directHref: platformLinks.find((platform) => platform.id === "spotify")!.href,
    allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
  },
  soundcloud: {
    label: "SoundCloud",
    src: soundcloudEmbedUrl,
    title: "SoundCloud player",
    height: 300,
    directHref: soundcloudPlaylistUrl,
    allow: "autoplay",
  },
};

export default function Listen() {
  const [activeProvider, setActiveProvider] = React.useState<EmbedProvider | null>(null);
  const [status, setStatus] = React.useState<EmbedStatus>("idle");

  React.useEffect(() => {
    if (!activeProvider || status !== "loading") return;
    const timeout = window.setTimeout(() => setStatus("timed-out"), 12_000);
    return () => window.clearTimeout(timeout);
  }, [activeProvider, status]);

  const loadProvider = (provider: EmbedProvider) => {
    setActiveProvider(provider);
    setStatus("loading");
  };

  const activeEmbed = activeProvider ? embedDetails[activeProvider] : null;

  return (
    <div className={`studioPage ${styles.page}`}>
      <header className={`studioPageHeader ${styles.header}`}>
        <p className="studioKicker">External playback</p>
        <h1 className="studioTitle">Listen</h1>
        <p className="studioLead">Recordings &amp; selections.</p>
      </header>

      <section className={styles.console} aria-label="Listening console">
        <StudioWindow
          title={activeEmbed ? `${activeEmbed.label} / external player` : "Select a source"}
          tone="paper"
          className={styles.playerWindow}
        >
          <div className={styles.sourceButtons} aria-label="Player sources">
            {(["spotify", "soundcloud"] as const).map((provider) => (
              <button
                key={provider}
                type="button"
                className={styles.sourceButton}
                aria-pressed={activeProvider === provider}
                aria-label={`Load ${embedDetails[provider].label} player`}
                onClick={() => loadProvider(provider)}
              >
                <span>{embedDetails[provider].label}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div className={styles.playerWell}>
            {!activeEmbed ? (
              <div className={styles.idleState}>
                <span className={styles.idleGlyph} aria-hidden="true">ERROR</span>
                <p>No third-party player loaded.</p>
                <p className={styles.idleNote}>Direct links are available in the footer.</p>
              </div>
            ) : (
              <>
                {status === "loading" && (
                  <p className={styles.playerStatus} role="status">
                    Connecting to {activeEmbed.label}…
                  </p>
                )}
                {status === "timed-out" && (
                  <div className={styles.timeoutState} role="alert">
                    <p>The player is taking longer than expected.</p>
                    <a href={activeEmbed.directHref} target="_blank" rel="noopener noreferrer">
                      Open {activeEmbed.label} directly
                    </a>
                  </div>
                )}
                <div className={activeProvider === "spotify" ? "studioPlayerViewport studioSquarePlayer" : "studioPlayerViewport"} style={{ "--player-height": `${activeEmbed.height}px` } as React.CSSProperties}>
                <iframe
                  key={activeProvider}
                  title={activeEmbed.title}
                  src={activeEmbed.src}
                  width="100%"
                  height={activeEmbed.height}
                  allow={activeEmbed.allow}
                  allowFullScreen={activeProvider === "spotify"}
                  loading="lazy"
                  className={styles.embed}
                  onLoad={() => setStatus("ready")}
                />
                </div>
              </>
            )}
          </div>
        </StudioWindow>

        <div className={styles.artworkPanel} aria-hidden="true">
          <div className={styles.artworkTitle}>
            <span>Signal study</span>
            <span>↙</span>
          </div>
          <SignalArtwork className={styles.artwork} pace="energetic" />
          <div className={styles.artworkFooter}>
            <span>Random Gorsey</span>
            <span>Generative artwork</span>
          </div>
        </div>
      </section>

    </div>
  );
}
