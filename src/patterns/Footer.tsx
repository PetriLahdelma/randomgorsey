import React from 'react';
import { SocialIcon } from 'react-social-icons';
import styles from './Footer.module.css';
import { SiBandcamp } from "react-icons/si";

const BandcampIcon = SiBandcamp as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['social-links']}>
        <SocialIcon label="Spotify" url="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} title="Spotify" />
        <SocialIcon label="Soundcloud" url="https://soundcloud.com/randomgorsey" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} title="Soundcloud" />
        <SocialIcon label="Instagram" url="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} title="Instagram" />
        <SocialIcon label="YouTube" url="https://www.youtube.com/@randomgorsey8125" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} title="YouTube" />
        <a className={styles['bandcamp-link']} href='https://randomgorsey.bandcamp.com' title="Bandcamp" aria-label="Bandcamp" target="_blank" rel="noopener noreferrer">
          <BandcampIcon
            style={{ width: '1rem', height: '1rem', color: '#fff', alignItems: 'center' }} />
        </a>
      </div>
      <p className={styles['footer-copyright']}>
        &copy; {new Date().getFullYear()} &nbsp;Random Gorsey. Rights reserved.&nbsp;
        <a
          href="https://www.instagram.com/digitaltableteur"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: '#fff' }}
        >
          <span title="Site by Digitaltableteur" className={styles['hide-on-mobile']}>
            Site by
          </span>
          <img
        src="/images/dt.svg"
        title="Site by Digitaltableteur"
        alt="Digitaltableteur"
        style={{ width: '1.2rem', height: '1.2rem', filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg)', marginLeft: '0.3rem' }}
          />
        </a>
      </p>
    </footer>
  );
};

export default Footer;