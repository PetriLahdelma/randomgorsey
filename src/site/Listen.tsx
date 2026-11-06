"use client";

import type { CSSProperties } from "react";

import { playerDetails } from "@/components/player/player-config";
import { usePersistentPlayer } from "@/components/player/PersistentPlayer";
import { SignalArtwork } from "@/components/studio/SignalArtwork";
import { SignalLabel } from "@/components/studio/SignalLabel";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { StudioWindow } from "@/components/studio/StudioWindow";
import styles from "./Listen.module.css";

export default function Listen() {
  const { activeProvider, status, presentation, loadProvider } = usePersistentPlayer();
  const activeEmbed = activeProvider ? playerDetails[activeProvider] : null;

  return (
    <div className={`studioPage ${styles.page}`}>
      <StudioPageHeader
        kicker="External playback"
        title="Listen"
        lead="Recordings & selections."
        className={styles.header}
      />

      <section
        className={styles.console}
        aria-label="Listening console"
        style={{
          "--listen-player-height": `${activeEmbed?.frameHeight ?? 280}px`,
          "--listen-player-max-height": `${Math.max(playerDetails.spotify.frameHeight, playerDetails.soundcloud.frameHeight)}px`,
        } as CSSProperties}
      >
        <StudioWindow
          title={activeEmbed ? `${activeEmbed.label} / sitewide player` : "Select a source"}
          tone="paper"
          className={`${styles.playerWindow} ${activeProvider && presentation === "compact" ? styles.playerWindowMinimized : ""}`}
          inert={Boolean(activeProvider && presentation === "compact")}
        >
          <div className={styles.sourceButtons} aria-label="Player sources">
            {(["spotify", "soundcloud"] as const).map((provider) => (
              <button
                key={provider}
                type="button"
                className={styles.sourceButton}
                aria-pressed={activeProvider === provider}
                aria-label={`Load ${playerDetails[provider].label} player`}
                onClick={(event) => loadProvider(provider, event.currentTarget)}
              >
                <span>{playerDetails[provider].label}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div
            className={`${styles.playerWell} ${!activeEmbed ? styles.playerWellIdle : ""}`}
            data-player-anchor
          >
            {!activeEmbed ? (
              <div className={styles.idleState}>
                <span className={styles.idleGlyph} aria-hidden="true">ERROR</span>
                <p>No third-party player loaded.</p>
                <p className={styles.idleNote}>Direct links are available in the footer.</p>
              </div>
            ) : (
              <div className={styles.activeState}>
                <span className={styles.idleGlyph} aria-hidden="true">LIVE</span>
                <p>{status === "loading" ? `${activeEmbed.label} player is opening.` : `${activeEmbed.label} player is available sitewide.`}</p>
                <p className={styles.idleNote}>{status === "timed-out" ? "The provider is taking longer than expected." : "Use the provider controls to start or manage playback."}</p>
              </div>
            )}
          </div>
        </StudioWindow>

        <div className={styles.artworkPanel} aria-hidden="true">
          <div className={styles.artworkTitle}>
            <SignalLabel />
            <span>↙</span>
          </div>
          <SignalArtwork className={styles.artwork} pace="energetic" />
          <div className={styles.artworkFooter}>
            <span>Random Gorsey</span>
          </div>
        </div>
      </section>

    </div>
  );
}
