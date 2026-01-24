import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import {
  motion,
  AnimatePresence,
  galleryVariants,
  galleryStaggerContainer,
  staggerItem,
  overlayVariants,
  modalVariants,
} from '@/lib/motion';
import { VideoBackground } from '@/components/effects';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';
import { KineticText } from '@/components/KineticText';
import RevealOnScroll from '../components/RevealOnScroll';
import styles from './Gallery.module.css';
import Spinner from '../components/Spinner';
import galleryImages from '../data/galleryImages';
import Caption from '../components/Caption';
import PageMeta from '../components/PageMeta';
import logoCanvasVideo from '../videos/logo_canvas.webm';

type GalleryProps = {
  onOverlayStateChange?: (state: boolean) => void;
};

/**
 * Gallery Page
 *
 * A light, spacious exhibition space for visual content.
 * Features:
 * - VideoBackground with poster fallback for mobile/low-power devices
 * - Staggered image grid reveals using galleryStaggerContainer
 * - Polished lightbox with modalVariants for smooth enter/exit
 * - Keyboard navigation (arrows, escape)
 */
const Gallery: React.FC<GalleryProps> = ({ onOverlayStateChange }) => {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  const images = useMemo(() => galleryImages, []);

  const openOverlay = (index: number) => {
    setOverlayImage(images[index].src);
    setCurrentIndex(index);
    onOverlayStateChange?.(true);
  };

  const closeOverlay = useCallback(() => {
    setOverlayImage(null);
    onOverlayStateChange?.(false);
  }, [onOverlayStateChange]);

  const navigateLeft = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    setOverlayImage(images[currentIndex > 0 ? currentIndex - 1 : images.length - 1].src);
  }, [currentIndex, images]);

  const navigateRight = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    setOverlayImage(images[currentIndex < images.length - 1 ? currentIndex + 1 : 0].src);
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      } else if (event.key === 'ArrowLeft') {
        navigateLeft();
      } else if (event.key === 'ArrowRight') {
        navigateRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOverlay, navigateLeft, navigateRight]);

  const handleContentLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <PageMeta
        title="Gallery | Random Gorsey"
        description="Photo gallery featuring Random Gorsey visuals."
        path="/gallery"
      />

      {/* Performance-tiered video background with poster fallback */}
      <VideoBackground
        src={logoCanvasVideo}
        poster="/images/gallery-poster.jpg"
        overlayOpacity={0.1}
      />

      <motion.div
        className={styles['gallery-container']}
        data-section="gallery"
        variants={galleryVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {loading && <Spinner />}

        <Container size="md" padding="md">
          <Stack gap="xl">
            {/* Animated headline with word-by-word reveal for gentle feel */}
            <RevealOnScroll>
              <KineticText
                as="h1"
                splitBy="words"
                variant="default"
                className="mx-auto w-full max-w-[90%] text-center uppercase tracking-[0.02em] text-[clamp(1.5rem,4.8vw,2.6rem)]"
              >
                Gallery
              </KineticText>
            </RevealOnScroll>

            {/* Staggered image grid */}
            <motion.div
              variants={galleryStaggerContainer}
              initial="initial"
              animate="enter"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {images.map((image, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <button
                    type="button"
                    className={styles["image-button"]}
                    onClick={() => openOverlay(index)}
                    aria-label={`Open image: ${image.caption}`}
                  >
                    <img
                      loading="lazy"
                      src={image.src}
                      alt={image.caption}
                      title={image.caption}
                      className="w-full rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                      onLoad={index === 0 ? handleContentLoad : undefined}
                    />
                  </button>
                  <Caption>{image.caption}</Caption>
                </motion.div>
              ))}
            </motion.div>
          </Stack>
        </Container>

        {/* Lightbox overlay with polished transitions */}
        <AnimatePresence>
          {overlayImage && (
            <motion.div
              className={styles['overlay']}
              onClick={closeOverlay}
              variants={overlayVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Image viewer"
              data-lenis-prevent
            >
              <button
                type="button"
                className={styles["close-icon"]}
                aria-label="Close image"
                onClick={(e) => {
                  e.stopPropagation();
                  closeOverlay();
                }}
              >
                <XMarkIcon aria-hidden="true" className={styles["icon"]} />
              </button>
              <button
                type="button"
                className={styles["left-icon"]}
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLeft();
                }}
              >
                <ArrowLeftIcon aria-hidden="true" className={styles["icon"]} />
              </button>

              {/* Lightbox content with modal scale animation */}
              <motion.div
                variants={modalVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="relative flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={overlayImage}
                  alt={images[currentIndex].caption}
                  title={images[currentIndex].caption}
                  className="max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain"
                  onClick={navigateRight}
                />
                <Caption>{images[currentIndex].caption}</Caption>
              </motion.div>

              <button
                type="button"
                className={styles["right-icon"]}
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateRight();
                }}
              >
                <ArrowRightIcon aria-hidden="true" className={styles["icon"]} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Gallery;
