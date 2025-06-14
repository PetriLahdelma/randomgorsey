import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';
import Spinner from '../components/Spinner';

const About: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  const handleContentLoad = () => {
    setLoading(false);
  };

  return (
    <motion.div
      className={styles['about-container']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading && <Spinner />}
      <h2>About</h2>
            <figure>
        <video title="Portrait of Random Gorsey" src="/images/portrait.webm" autoPlay muted loop controls={false} style={{ width: '10vw', borderRadius: '50%' }} onLoadedData={handleContentLoad} />
      </figure>

    <p className={styles['about-description']}>
      Helsinki-based producer/musician Random Gorsey aka DJ Pizza Hut makes warm, nostalgic lo-fi house and electronic music with soulful chords and minimalist grooves. His music pays homage to mid-paced, high-energy electronic music. <br /><br />Having spent the last few years producing for his own amusement and after his debut EP steadily brought the much-needed confidence, he decided to take a step forward and start producing on a more regular basis.  Random G doesn't feel he belongs to any particular scene. As is the nature of his music, he just acts on instinct and goes wherever it takes him and tries not to overthink it. <br /><br />Originally from Turku, Finland, he studied graphic design in the UK, before returning to Finland for his master's. While he is currently on hiatus focusing on his design career, he has always had a deep passion for making music. He loves exploring new tools, sounds, and ideas, constantly finding fresh processes in an artistic way. Mostly he is inspired by aestheticism, raw energy, and talent, always looking to solve problems and push creative boundaries.
    </p>
      <h2>Side projects</h2>
      <p className={styles['about-description']}>
        Random Gorsey is also involved in several side projects, including:
      </p>
        <ul>
          <li className={styles.card} onClick={() => window.open('https://soundcloud.com/petri-lahdelma', '_blank')}>
            <img src="/images/scportrait.jpg" alt="Petri Lahdelma" onLoad={handleContentLoad} />
            <a href="https://soundcloud.com/petri-lahdelma" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              Petri Lahdelma - A raw techno project on Soundcloud.
            </a>
          </li>
          <li className={styles.card} onClick={() => window.open('https://soundcloud.com/dj-pizza-hut', '_blank')}>
            <img src="/images/scpizza.jpg" alt="Dj Pizza Hut" onLoad={handleContentLoad} />
            <a href="https://soundcloud.com/dj-pizza-hut" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              Dj Pizza Hut - Honestly, I don't even know, man. Check it out on SC.
            </a>
          </li>
          </ul>
    </motion.div>
  );
};

export default About;