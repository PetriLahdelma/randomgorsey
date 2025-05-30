import React from 'react';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  return (
    <div className={styles['gallery-container']}>
      <h2>Gallery</h2>
      <img
        src="/images/ompputalo.jpg"
        alt="Ompputalo"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Ompputalo in Lapinlahti, Helsinki
      </figcaption>
      <img
        src="/images/kaiku.jpg"
        alt="Kaiku"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Kaiku, Helsinki
      </figcaption>
      <img
        src="/images/promo.jpg"
        alt="Kaiku"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Promo shot by a friend, Helsinki
      </figcaption>
    </div>
  );
};

export default Gallery;