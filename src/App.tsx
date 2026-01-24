import React, { Suspense, useState, lazy, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AnimationProvider, AnimatedRoutes } from '@/lib/motion';
import { CursorProvider } from '@/lib/cursor';
import Footer from './patterns/Footer';
import Header from './patterns/Header';
import CookieConsent from './components/CookieConsent';
import Spinner from './components/Spinner';
import { initializeSecurityMeasures } from './utils/httpsEnforcement';

const Home = lazy(() => import('./pages/Home'));
const Listen = lazy(() => import('./pages/Listen'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Discography = lazy(() => import('./pages/Discography'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Post = lazy(() => import('./pages/Post'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const handleOverlayState = setIsOverlayActive;

  // Initialize security measures on app load
  useEffect(() => {
    initializeSecurityMeasures();
  }, []);

  return (
    <AnimationProvider>
      <CursorProvider>
        <BrowserRouter>
          <div className={cn(
            "flex flex-col min-h-screen text-center"
          )}>
            <Header />
            <Suspense fallback={<Spinner />}>
              <AnimatedRoutes>
                <Route path="/" element={<Home />} />
                <Route path="/listen" element={<Listen />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/discography" element={<Discography />} />
                <Route path="/gallery" element={<Gallery onOverlayStateChange={handleOverlayState} />} />
                <Route path="/posts/:id" element={<Post />} />
                <Route path="*" element={<NotFound />} />
              </AnimatedRoutes>
            </Suspense>
            {!isOverlayActive && <Footer />}
            <CookieConsent />
          </div>
        </BrowserRouter>
      </CursorProvider>
    </AnimationProvider>
  );
};

export default App;
