import React, { Suspense, useState, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './patterns/Footer';
import Header from './patterns/Header';
import CookieConsent from './components/CookieConsent';
import Spinner from './components/Spinner';
import styles from './App.module.css';
import { initializeSecurityMeasures } from './utils/httpsEnforcement';

const Home = lazy(() => import('./pages/Home'));
const Listen = lazy(() => import('./pages/Listen'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Discography = lazy(() => import('./pages/Discography'));
const Gallery = lazy(() => import('./pages/Gallery'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const handleOverlayState = setIsOverlayActive;

  // Initialize security measures on app load
  useEffect(() => {
    initializeSecurityMeasures();
  }, []);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listen" element={<Listen />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/discography" element={<Discography />} />
            <Route path="/gallery" element={<Gallery onOverlayStateChange={handleOverlayState} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!isOverlayActive && <Footer />}
        <CookieConsent />
      </div>
    </BrowserRouter>
  );
};

export default App;
