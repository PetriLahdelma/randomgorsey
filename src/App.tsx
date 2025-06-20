import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './patterns/Footer';
import Header from './patterns/Header';
import Home from './pages/Home';
import Listen from './pages/Listen';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import Discography from './pages/Discography';
import CookieConsent from './components/CookieConsent';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listen" element={<Listen />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/discography" element={<Discography />} />
          <Route path="/gallery" element={<Gallery onOverlayStateChange={handleOverlayState} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!isOverlayActive && <Footer />}
        <CookieConsent />
      </div>
    </HashRouter>
  );
};

export default App;
