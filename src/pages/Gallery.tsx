import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import styles from './Gallery.module.css';

type GalleryProps = {
  onOverlayStateChange?: (state: boolean) => void;
};

const Gallery: React.FC<GalleryProps> = ({ onOverlayStateChange }) => {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const images = [
    { src: '/images/clipart.jpg', caption: 'Clipart, Helsinki' },
    { src: '/images/ride.jpg', caption: 'Ride in Birgit, Berlin' },
    { src: '/images/disco.jpg', caption: 'Disco balls in Birgit, Berlin' },
    { src: '/images/xberg.jpg', caption: 'Xberg Acid, Berlin' },
    { src: '/images/gordon.jpg', caption: 'Random Illustration, Helsinki' },
    { src: '/images/ompputalo.jpg', caption: 'Ompputalo in Lapinlahti, Helsinki' },
    { src: '/images/kuvaxtila.jpg', caption: 'Projections in Kuva x Tila, Helsinki' },
    { src: '/images/laser.jpg', caption: 'Warning, Lasers, Helsinki' },
    { src: '/images/smokebreak.jpg', caption: 'Smoke break, Helsinki' },
    { src: '/images/discosea.jpg', caption: 'Disco at sea, Helsinki' },
    { src: '/images/kaiku.jpg', caption: 'Kaiku, Helsinki' },
    { src: '/images/freedom.jpg', caption: 'Occupied freedom, Helsinki' },
    { src: '/images/promo.jpg', caption: 'Shot by a friend, Helsinki' },
  ];

  const openOverlay = (index: number) => {
    setOverlayImage(images[index].src);
    setCurrentIndex(index);
    onOverlayStateChange?.(true);
  };

  const closeOverlay = () => {
    setOverlayImage(null);
    onOverlayStateChange?.(false);
  };

  const navigateLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    setOverlayImage(images[currentIndex > 0 ? currentIndex - 1 : images.length - 1].src);
  };

  const navigateRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    setOverlayImage(images[currentIndex < images.length - 1 ? currentIndex + 1 : 0].src);
  };

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

  return (
    <div className={styles['gallery-container']}>
      <h2>Gallery</h2>
      {images.map((image, index) => (
        <div key={index}>
          <img
            loading="lazy"
            src={image.src}
            alt={image.caption}
            style={{ width: '100%', borderRadius: '8px', marginTop: '1rem' }}
            onClick={() => openOverlay(index)}
          />
          <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
            {image.caption}
          </figcaption>
        </div>
      ))}

      {overlayImage && (
        <div className={styles['overlay']}>
          <XMarkIcon className={styles['close-icon']} onClick={closeOverlay} />
          <ArrowLeftIcon className={styles['left-icon']} onClick={navigateLeft} />
          <img src={overlayImage} alt={images[currentIndex].caption} style={{ width: '100%' }} />
          <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
            {images[currentIndex].caption}
          </figcaption>
          <ArrowRightIcon className={styles['right-icon']} onClick={navigateRight} />
        </div>
      )}
    </div>
  );
};

export default Gallery;