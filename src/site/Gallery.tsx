"use client";

import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

import { useAppShell } from "@/components/AppShell";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { StudioWindow } from "@/components/studio/StudioWindow";
import galleryImages from "@/data/galleryImages";

import styles from "./Gallery.module.css";

const Gallery: React.FC = () => {
  const { setOverlayActive } = useAppShell();
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);
  const triggerRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const previousOverflow = React.useRef("");
  const focusReturnIndex = React.useRef<number | null>(null);
  const openerIndex = React.useRef<number | null>(null);

  const closeViewer = React.useCallback(() => {
    focusReturnIndex.current = openerIndex.current;
    setCurrentIndex(null);
    setOverlayActive(false);
  }, [setOverlayActive]);

  const showPrevious = React.useCallback(() => {
    setCurrentIndex((index) => index === null ? 0 : (index - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const showNext = React.useCallback(() => {
    setCurrentIndex((index) => index === null ? 0 : (index + 1) % galleryImages.length);
  }, []);

  React.useEffect(() => {
    if (currentIndex !== null || focusReturnIndex.current === null) return;
    triggerRefs.current[focusReturnIndex.current]?.focus();
    focusReturnIndex.current = null;
  }, [currentIndex]);

  React.useEffect(() => {
    if (currentIndex === null) return;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow.current; };
  }, [currentIndex]);

  React.useEffect(() => {
    if (currentIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Tab") {
        const focusable = Array.from(
          overlayRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeViewer, currentIndex, showNext, showPrevious]);

  React.useEffect(() => () => {
    setOverlayActive(false);
    document.body.style.overflow = previousOverflow.current;
  }, [setOverlayActive]);

  const currentImage = currentIndex === null ? null : galleryImages[currentIndex];

  return (
    <div className={`studioPage ${styles.page}`}>
      <StudioPageHeader
        kicker={`${galleryImages.length} images / Helsinki & Berlin`}
        title="Gallery"
        lead="Covers, rooms, lights, weather and the things that survived the night."
        className={styles.header}
        leadClassName={styles.intro}
      />

      <section className={styles.contactSheet} aria-label={`${galleryImages.length} gallery images`}>
        {galleryImages.map((image, index) => (
          <StudioWindow key={image.src} title={image.caption} tone="paper" className={styles.figureWindow}>
            <figure className={styles.figure}>
              <button
                ref={(node) => { triggerRefs.current[index] = node; }}
                type="button"
                className={styles.imageButton}
                onClick={() => {
                  openerIndex.current = index;
                  setCurrentIndex(index);
                  setOverlayActive(true);
                }}
                aria-label={`Open image: ${image.caption}`}
              >
                <Image src={image.src} alt={image.alt ?? image.caption} width={image.width} height={image.height} sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 1000px) 45vw, 30vw" className={`${styles.image} ${image.src === "/images/random-gorsey-grit-poster.png" ? styles.posterImage : ""}`} />
                <span className={styles.fileIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </button>
              <figcaption className={styles.figureMeta}>
                <span>{image.width} × {image.height}</span>
                <span>Open</span>
              </figcaption>
            </figure>
          </StudioWindow>
        ))}
      </section>

      {currentImage && currentIndex !== null && (
        <div ref={overlayRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="Image viewer" data-lenis-prevent onMouseDown={(event) => { if (event.target === event.currentTarget) closeViewer(); }}>
          <div className={styles.viewer}>
            <div className={styles.viewerTitlebar}>
              <span>{currentImage.caption}</span>
              <button ref={closeRef} type="button" className={styles.windowClose} aria-label="Close image" onClick={closeViewer}><XMarkIcon aria-hidden="true" /></button>
            </div>
            <div className={styles.viewerImageArea}>
              <Image src={currentImage.src} alt={currentImage.alt ?? currentImage.caption} width={currentImage.width} height={currentImage.height} sizes="92vw" priority className={styles.viewerImage} />
            </div>
            <div className={styles.viewerControls}>
              <button type="button" onClick={showPrevious} aria-label="Previous image"><ArrowLeftIcon aria-hidden="true" />Previous</button>
              <p aria-live="polite">{currentImage.caption} · {currentIndex + 1} / {galleryImages.length}</p>
              <button type="button" onClick={showNext} aria-label="Next image">Next<ArrowRightIcon aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
