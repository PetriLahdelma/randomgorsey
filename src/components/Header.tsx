import React from 'react';

import './Header.module.css';

const Header: React.FC = () => {
  return (
    <header>
    <a href="/">
<img src="/images/logo.jpg" alt="Random Gorsey Website" title="Back to the Homepage"/>    </a>
      <nav>
        <ul>
          <li><a href="#/" title="Go to Home page">Home</a></li>
          <li><a href="#/listen" title="Go to Listen page">Listen</a></li>
          <li><a href="#/about" title="Info about RG">About</a></li>
          <li><a href="#/contact" title="Contact RG">Contact</a></li>
          <li><a href="#/gallery" title="View Gallery">Gallery</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;