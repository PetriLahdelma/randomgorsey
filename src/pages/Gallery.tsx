import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import styles from './Gallery.module.css';
import Spinner from '../components/Spinner';
import galleryImages from '../data/galleryImages';

type GalleryProps = {
  onOverlayStateChange?: (state: boolean) => void;
};

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
    <div className={styles['gallery-container']}>
      {loading && <Spinner />}
      <div className={styles['gallery-content']}>
        <h2>Gallery</h2>
        {images.map((image, index) => (
          <div key={index}>
            <img
              loading="lazy"
              src={image.src}
              alt={image.caption}
              style={{ width: '100%', borderRadius: '8px', marginTop: '1rem' }}
              onClick={() => openOverlay(index)}
              onLoad={index === 0 ? handleContentLoad : undefined}
            />
            <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
              {image.caption}
            </figcaption>
          </div>
        ))}

        {overlayImage && (
          <div className={styles['overlay']} onClick={closeOverlay}>
            <XMarkIcon className={styles['close-icon']} onClick={closeOverlay} />
            <ArrowLeftIcon className={styles['left-icon']} onClick={(e) => { e.stopPropagation(); navigateLeft(); }} />
            <img
              src={overlayImage}
              alt={images[currentIndex].caption}
              style={{ width: '100%' }}
              onClick={(e) => { e.stopPropagation(); navigateRight(); }}
            />
            <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
              {images[currentIndex].caption}
            </figcaption>
            <ArrowRightIcon className={styles['right-icon']} onClick={(e) => { e.stopPropagation(); navigateRight(); }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;