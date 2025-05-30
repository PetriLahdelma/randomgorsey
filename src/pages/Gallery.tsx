import React from 'react';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  return (
    <div className={styles['gallery-container']}>
      <h2>Gallery</h2>
      <img
        src="/images/ride.jpg"
        alt="Ride in BLN"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Ride in Birgit, Berlin
      </figcaption>
      <img
        src="/images/disco.jpg"
        alt="Disco balls in BLN"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Disco balls in Birgit, Berlin
      </figcaption>
      <img
        src="/images/xberg.jpg"
        alt="Xberg Acid, Berlin"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Xberg Acid, Berlin
      </figcaption>
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
        src="/images/kuvaxtila.jpg"
        alt="Kuva x Tila"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Projections in Kuva x Tila, Helsinki
      </figcaption>
      <img
        src="/images/laser.jpg"
        alt="Lasers"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Warning, Lasers, Helsinki
      </figcaption>
      <img
        src="/images/smokebreak.jpg"
        alt="Smoke break"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Smoke break, Helsinki
      </figcaption>
      <img
        src="/images/discosea.jpg"
        alt="Disco at sea"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Disco at sea, Helsinki
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
        src="/images/freedom.jpg"
        alt="Freedom"
        style={{
          width: '100%',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      />
      <figcaption style={{ textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: '#fff' }}>
        Occupied freedom, Helsinki
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
        Shot by a friend, Helsinki
      </figcaption>
    </div>
  );
};

export default Gallery;