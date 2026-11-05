"use client";

import Image from "next/image";
import React from "react";

import { StudioWindow } from "@/components/studio/StudioWindow";
import { usePerformance } from "@/lib/performance";

import styles from "./About.module.css";

const biography = [
  "Helsinki-based producer Random Gorsey aka DJ Pizza Hut makes warm, nostalgic lo-fi house and electronic music. Soulful chords, minimalist grooves, mid-paced and high-energy. Connected to both the Helsinki and global electronic scenes.",
  "Self-taught and driven by instinct. Random G doesn't belong to any particular scene and doesn't try to. He acts on instinct, explores wherever creativity takes him, and tries not to overthink it.",
  "Actively producing and exploring new tools, sounds, and ideas. Always finding fresh processes, inspired by raw energy and aestheticism, pushing creative boundaries.",
] as const;

const projects = [
  {
    href: "https://soundcloud.com/petri-lahdelma",
    image: "/images/scportrait.jpg",
    imageAlt: "Petri Lahdelma portrait",
    text: "Petri Lahdelma - A raw techno project on Soundcloud.",
  },
  {
    href: "https://soundcloud.com/dj-pizza-hut",
    image: "/images/scpizza.jpg",
    imageAlt: "DJ Pizza Hut",
    text: "Dj Pizza Hut - Honestly, I don't even know, man. Check it out on SC.",
  },
] as const;

const About: React.FC = () => {
  const { effectsEnabled, isReducedMotion } = usePerformance();
  const [manualPlayback, setManualPlayback] = React.useState(false);
  const [portraitPlaying, setPortraitPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const shouldAutoPlay = effectsEnabled && !isReducedMotion;
  const showVideo = shouldAutoPlay || manualPlayback;

  React.useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    const video = videoRef.current;
    video.play().catch(() => setPortraitPlaying(false));
  }, [showVideo]);

  const togglePortrait = () => {
    const video = videoRef.current;
    if (!showVideo || !video) {
      setManualPlayback(true);
      return;
    }
    if (portraitPlaying) {
      video.pause();
    } else {
      video.play().catch(() => setPortraitPlaying(false));
    }
  };

  return (
    <div className={`studioPage ${styles.page}`}>
      <header className={`studioPageHeader ${styles.header}`}>
        <p className="studioKicker">Helsinki / producer / DJ</p>
        <h1 className="studioTitle">About</h1>
        <p className={`studioLead ${styles.intro}`}>
          The work is the introduction. A few facts sit beside it.
        </p>
      </header>

      <section className={styles.composition} aria-label="Artist biography">
        <StudioWindow
          title="Portrait"
          tone="dark"
          className={styles.portraitWindow}
        >
          <figure className={styles.portraitFigure}>
            {showVideo ? (
              <video
                ref={videoRef}
                title="Portrait of Random Gorsey"
                muted
                loop
                autoPlay
                playsInline
                poster="/images/portrait.jpg"
                className={styles.portrait}
                onPlay={() => setPortraitPlaying(true)}
                onPause={() => setPortraitPlaying(false)}
                onEnded={() => setPortraitPlaying(false)}
              >
                <source src="/videos/portrait-loop.webm" type="video/webm" />
                <source src="/videos/portrait-loop.mp4" type="video/mp4" />
              </video>
            ) : (
              <Image
                src="/images/portrait.jpg"
                alt="Portrait of Random Gorsey"
                width={984}
                height={984}
                sizes="(max-width: 720px) calc(100vw - 64px), 42vw"
                priority
                className={styles.portrait}
              />
            )}
            <figcaption className={styles.portraitControls}>
              <button
                type="button"
                className="studioButton"
                onClick={togglePortrait}
              >
                {portraitPlaying ? "Pause portrait loop" : "Play portrait loop"}
              </button>
            </figcaption>
          </figure>
        </StudioWindow>

        <StudioWindow title="random-gorsey.txt" tone="paper" className={styles.biographyWindow}>
          <div className={styles.biography}>
            {biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </StudioWindow>
      </section>

      <section className={styles.projects} aria-labelledby="other-projects">
        <div className={styles.sectionHeading}>
          <p className="studioKicker">Selected aliases</p>
          <h2 id="other-projects">Other projects</h2>
          <p>Beyond Random Gorsey, there are a few other things going on:</p>
        </div>

        <div className={styles.projectList}>
          {projects.map((project, index) => (
            <a key={project.href} href={project.href} target="_blank" rel="noopener noreferrer" className={styles.project}>
              <span className={styles.projectIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <Image src={project.image} alt={project.imageAlt} width={1080} height={1080} sizes="72px" className={styles.projectImage} />
              <span className={styles.projectText}>{project.text}</span>
              <span className={styles.projectArrow} aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
