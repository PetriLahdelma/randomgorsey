import React from 'react';
import { Link } from 'react-router-dom';

import './Header.module.css';

const Header: React.FC = () => {
  return (
    <header>
      <Link to="/">
        <img src="/images/logo.jpg" alt="Random Gorsey logo" title="Back to the Homepage" />
      </Link>
      <nav aria-label="Main navigation">
        <ul>
          <li><Link to="/" title="Go to Home page">Home</Link></li>
          <li><Link to="/listen" title="Go to Listen page">Listen</Link></li>
          <li><Link to="/about" title="Info about RG">About</Link></li>
          <li><Link to="/contact" title="Contact RG">Contact</Link></li>
          <li><Link to="/discography" title="View Discography">Discography</Link></li>
          <li><Link to="/gallery" title="View Gallery">Gallery</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;