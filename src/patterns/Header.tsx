import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidChevronUp, BiSolidChevronDown } from 'react-icons/bi';

import Button from '../components/Button';
import './Header.module.css';

const navLinks = [
  { to: '/', label: 'Home', title: 'Go to Home page' },
  { to: '/listen/', label: 'Listen', title: 'Go to Listen page' },
  { to: '/about/', label: 'About', title: 'Info about RG' },
  { to: '/contact/', label: 'Contact', title: 'Contact RG' },
  { to: '/discography/', label: 'Discography', title: 'View Discography' },
  { to: '/gallery/', label: 'Gallery', title: 'View Gallery' },
];

const ChevronUp = React.createElement(
  BiSolidChevronUp as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { className: 'chevron-icon', 'aria-hidden': 'true' }
);
const ChevronDown = React.createElement(
  BiSolidChevronDown as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { className: 'chevron-icon', 'aria-hidden': 'true' }
);


const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide mobile menu if switching to desktop
  React.useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  return (
    <header>
      <Link to="/">
        <img src="/images/logo.jpg" alt="Random Gorsey logo" title="Back to the Homepage" />
      </Link>
      <nav aria-label="Main navigation">
        {/* Desktop links */}
        {!isMobile && (
          <ul className="links-desktop">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link to={link.to} title={link.title}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
        {/* Mobile menu button */}
        {isMobile && (
          <>
            <Button
              variant="tertiary"
              className="menu-button"
              style={{ color: 'var(--color-white)' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(open => !open)}
              type="button"
              icon={menuOpen ? ChevronUp : ChevronDown}
            >
              Menu
            </Button>
            {/* Mobile dropdown menu */}
            {menuOpen && (
              <ul id="mobile-menu" className="dropdown-menu">
                {navLinks.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} title={link.title} onClick={() => setMenuOpen(false)}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
