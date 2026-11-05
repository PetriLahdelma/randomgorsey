import Image from "next/image";

import { StudioWindow } from "@/components/studio/StudioWindow";
import { releases } from "@/content/releases";

import styles from "./Discography.module.css";

export default function Discography() {
  return (
    <div className={`studioPage ${styles.page}`}>
      <header className="studioPageHeader">
        <p className="studioKicker">Selected recordings / 2021</p>
        <h1 className="studioTitle">Discography</h1>
        <p className="studioLead">
          Two documents from the catalog. Artwork, tracklists and original platform destinations.
        </p>
      </header>

      <div className={styles.releaseStack}>
        {releases.map((release, index) => (
          <article id={release.id} key={release.id} className={styles.release}>
            <div className={styles.artworkFrame}>
              <Image
                src={release.image}
                alt={`${release.title} cover artwork`}
                fill
                sizes="(max-width: 720px) 100vw, 48vw"
                className={styles.artwork}
                priority={index === 0}
              />
              <span className={styles.artworkIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <StudioWindow
              title={`${release.catalog} / ${release.year}`}
              tone={index === 0 ? "blue" : "paper"}
              className={styles.releaseWindow}
            >
              <div className={styles.releaseContent}>
                <p className={styles.catalog}>{release.catalog}</p>
                <h2>{release.title}</h2>

                {release.tracks && (
                  <ol className={styles.tracklist} aria-label={`${release.title} tracklist`}>
                    {release.tracks.map((track, trackIndex) => (
                      <li key={track}>
                        <span>{String(trackIndex + 1).padStart(2, "0")}</span>
                        <span>{track}</span>
                      </li>
                    ))}
                  </ol>
                )}

                <div className={styles.releaseLinks}>
                  <a
                    href={release.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${release.title} on Bandcamp`}
                  >
                    Bandcamp <span aria-hidden="true">↗</span>
                  </a>
                  {release.spotify && (
                    <a
                      href={release.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${release.title} on Spotify`}
                    >
                      Spotify <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </StudioWindow>
          </article>
        ))}
      </div>
    </div>
  );
}
