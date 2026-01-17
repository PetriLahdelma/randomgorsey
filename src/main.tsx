import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';  // Tailwind + theme + fonts + base styles
import App from './App';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
