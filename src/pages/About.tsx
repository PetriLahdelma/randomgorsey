import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h2>About</h2>
            <figure>
        <video src="/images/portrait.webm" autoPlay muted loop controls={false} style={{ width: '10vw', borderRadius: '50%' }} />
      </figure>

    <p className="about-description">
      Helsinki-based producer/musician Random Gorsey aka DJ Pizza Hut makes warm, nostalgic lo-fi house and electronic music with soulful chords and minimalist grooves. His music pays homage to slow-paced, high-energy electronic music. Having spent the last few years producing for his own amusement and after his debut EP steadily brought the much-needed confidence, he decided to take a step forward and start producing on a more regular basis.  Random G doesn't feel he belongs to any particular scene. As is the nature of his music, he just acts on instinct and goes wherever it takes him and tries hard not to overthink it.
    </p>
    </div>
  );
};

export default About;