import React from 'react';
import { motion } from 'framer-motion';
import styles from './Listen.module.css';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';

const Listen: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  const handleContentLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <PageMeta title="Listen | Random Gorsey" description="Stream songs and playlists from Random Gorsey." path="/listen" />
      {/* Background looping video */}
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
        <source src={require('../videos/rg-glitch-bg.webm')} type="video/webm" />
      </video>
      <motion.div
      className={styles['listen-container']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading && <Spinner />}
      <h1>Listen to Music</h1>
      <p className={styles['listen-description']}>Enjoy curated playlists and latest tracks.</p>
      {typeof window !== 'undefined' && (
        <>
          <iframe
            title="RG player"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            onLoad={handleContentLoad}
          ></iframe>
          <iframe style={{ borderRadius: '12px', marginTop: '1.6rem' }}
            title="SoundCloud Player"
            width="100%"
            height="300"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2029288998&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
          ></iframe>
        </>
      )}
      <div style={{ fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif', fontWeight: 100 }}>
        <a href="https://soundcloud.com/randomgorsey" title="Random Gorsey" target="_blank" rel="noreferrer" style={{ color: '#cccccc', textDecoration: 'none' }}>Random Gorsey</a> · <a href="https://soundcloud.com/randomgorsey/sets/tuunz" title="Tuunz" target="_blank" rel="noreferrer" style={{ color: '#cccccc', textDecoration: 'none' }}>Tuunz</a>
      </div>
    </motion.div>
    </>
  );
};

export default Listen;