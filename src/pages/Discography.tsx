import React from 'react';
import { motion } from 'framer-motion';
import styles from './Discography.module.css';
import SoLong from '../images/solongspectrum.jpg';
import Customer from '../images/CustomerIsAlwaysRight.jpg';
import PageMeta from '../components/PageMeta';
import { isWebMSupported } from '../utils/isWebMSupported';
import { isIOS } from '../utils/isIOS';
import firgoCanvasVideo from '../videos/FIRGO002_canvas.webm';

interface Release {
  title: string;
  catalog: string;
  year: number;
}

const releases: Release[] = [
  {
    title: 'So Long Spectrum',
    catalog: 'FIRGO2100004',
    year: 2022,
  },
  {
    title: 'The Customer is Always Right EP',
    catalog: 'RDGY 01',
    year: 2021,
  },
];

const Discography: React.FC = () => {
  const Container: React.ElementType = isIOS() ? 'div' : motion.div;

  return (
  <>
    <PageMeta title="Discography | Random Gorsey" description="Browse the official releases from Random Gorsey." path="/discography" />
    {/* Background looping video (disabled if WebM unsupported) */}
    {isWebMSupported() && (
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,

        }}
      >
        <source src={firgoCanvasVideo} type="video/webm" />
      </video>
    )}
    <Container
      className={styles['discography-container']}
      {...(!isIOS() && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      })}
    >
      <h1 className={styles['discography-title']}>
        <span className={styles['disco-break']}>Disco</span>
        <span className={styles['mobile-dash']}>-</span>
        graphy
      </h1>
    <div className={styles['release-grid']}>
      {releases.map((release) => {
        const buyHref =
          release.title === 'So Long Spectrum'
            ? 'https://randomgorsey.bandcamp.com/track/so-long-spectrum'
            : 'https://randomgorsey.bandcamp.com/album/the-customer-is-always-right';
        return (
          <div key={release.catalog} className={styles.release}>
            <a href={buyHref} target="_blank" rel="noopener noreferrer">
              <img
                src={release.title === 'So Long Spectrum' ? SoLong : Customer}
                alt={release.title}
                title={release.title}
                width={200}
                height={200}
              />
            </a>
            <h3>{release.title}</h3>
            <p>
              {release.catalog} · {release.year}
            </p>
            <a
              className={styles['buy-link']}
              href={buyHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              BUY
            </a>
          </div>
        );
      })}
    </div>
  </Container>
  </>
  );
};

export default Discography;
