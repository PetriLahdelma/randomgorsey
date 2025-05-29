import React from 'react';

import './Header.module.css';

const Header: React.FC = () => {
  return (
    <header>
    <a href="/">
<img src="/images/logo.jpg" alt="Random Gorsey Website" />    </a>
      <nav>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/about">About</a></li>
          <li><a href="#/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;