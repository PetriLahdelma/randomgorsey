import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Footer from './patterns/Footer';
import Header from './patterns/Header';
const Home = React.lazy(() => import('./pages/Home'));
const Listen = React.lazy(() => import('./pages/Listen'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Work = React.lazy(() => import('./pages/Gallery'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

import styles from './App.module.css';

const App: React.FC = () => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const handleOverlayState = (state: boolean) => {
    setIsOverlayActive(state);
  };

  return (
    <HashRouter>
      <div className={styles.app}>
        <Header />
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listen" element={<Listen />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Work onOverlayStateChange={handleOverlayState} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
        {!isOverlayActive && <Footer />}
      </div>
    </HashRouter>
  );
};

export default App;
