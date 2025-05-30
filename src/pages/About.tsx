import React from 'react';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles['about-container']}>
      <h2>About</h2>
            <figure>
        <video src="/images/portrait.webm" autoPlay muted loop controls={false} style={{ width: '10vw', borderRadius: '50%' }} />
      </figure>

    <p className={styles['about-description']}>
      Helsinki-based producer/musician Random Gorsey aka DJ Pizza Hut makes warm, nostalgic lo-fi house and electronic music with soulful chords and minimalist grooves. His music pays homage to slow-paced, high-energy electronic music. <br /><br />Having spent the last few years producing for his own amusement and after his debut EP steadily brought the much-needed confidence, he decided to take a step forward and start producing on a more regular basis.  Random G doesn't feel he belongs to any particular scene. As is the nature of his music, he just acts on instinct and goes wherever it takes him and tries not to overthink it. <br /><br />Originally from Turku, Finland, he studied graphic design in the UK, before returning to Finland for his master's. While he is currently on hiatus focusing on his design career, he has always had a deep passion for making music. He loves exploring new tools, sounds, and ideas, constantly finding fresh processes in an artistic way. Mostly he is inspired by aestheticism, raw energy, and talent, always looking to solve problems and push creative boundaries.
    </p>
      <h2>Side projects</h2>
      <p className={styles['about-description']}>
        Random Gorsey is also involved in several side projects, including:</p>
        <ul>
          <li><a href="https://soundcloud.com/petri-lahdelma" target="_blank" rel="noopener noreferrer">Petri Lahdelma</a> - A more coarse techno project.</li>
          <li><a href="https://soundcloud.com/dj-pizza-hut" target="_blank" rel="noopener noreferrer">Dj Pizza Hut</a> - Honestly, I don't even know, man.</li>
          </ul>
    </div>
  );
};

export default About;