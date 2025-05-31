import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Listen from './pages/Listen';
import NotFound from './pages/NotFound';
import Work from './pages/Gallery';

import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className={styles.app}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listen" element={<Listen />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Work />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
