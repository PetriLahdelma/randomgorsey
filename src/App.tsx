import React, { useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './patterns/Footer';
import Header from './patterns/Header';
import Home from './pages/Home';
import Listen from './pages/Listen';
import NotFound from './pages/NotFound';
import Work from './pages/Gallery';

import styles from './App.module.css';

const { HashRouter, Routes, Route } = ReactRouterDom;

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
          <Route path="/gallery" element={<Work onOverlayStateChange={handleOverlayState} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!isOverlayActive && <Footer />}
      </div>
    </HashRouter>
  );
};

export default App;
