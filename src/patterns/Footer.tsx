import React from 'react';
import { SocialIcon } from 'react-social-icons';
import './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="social-links">
        <SocialIcon
          label="Spotify"
          url="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg"
          bgColor="#000"
          fgColor="#fff"
          className="social-icon"
          title="Spotify"
        />
        <SocialIcon
          label="Soundcloud"
          url="https://soundcloud.com/randomgorsey"
          bgColor="#000"
          fgColor="#fff"
          className="social-icon"
          title="Soundcloud"
        />
        <SocialIcon
          label="Instagram"
          url="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr"
          bgColor="#000"
          fgColor="#fff"
          className="social-icon"
          title="Instagram"
        />
        <SocialIcon
          label="YouTube"
          url="https://www.youtube.com/@randomgorsey8125"
          bgColor="#000"
          fgColor="#fff"
          className="social-icon"
          title="YouTube"
        />
        <a 
          href="https://randomgorsey.bandcamp.com/"
          target="_blank"
          rel="noopener noreferrer"
          title="Bandcamp"
        >
          <img src="/images/bandcamp.svg" alt="Bandcamp" className="bandcamp-icon" />
        </a>
      </div>
      <p className="footerCopyright">
        &copy; {new Date().getFullYear()} &nbsp;Random Gorsey. Rights reserved.&nbsp;
        <a
          href="https://www.instagram.com/digitaltableteur"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <span title="Site by Digitaltableteur" className="hideOnMobile">Site by</span>
          <img
            src="/images/dt.svg"
            title="Site by Digitaltableteur"
            alt="Digitaltableteur"
            className="dt-icon"
          />
        </a>
      </p>
    </footer>
  );
};

export default Footer;