import React from 'react';
import { motion } from 'framer-motion';
import styles from './Discography.module.css';

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

const Discography: React.FC = () => (
  <motion.div
    className={styles['discography-container']}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h2>Discography</h2>
    <div className={styles['release-grid']}>
      {releases.map((release) => (
        <div key={release.catalog} className={styles.release}>
          <img
            src="https://via.placeholder.com/200"
            alt={release.title}
            width={200}
            height={200}
          />
          <h3>{release.title}</h3>
          <p>
            {release.catalog} · {release.year}
          </p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default Discography;
