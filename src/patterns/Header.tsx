import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidChevronUp, BiSolidChevronDown } from 'react-icons/bi';
import { cn } from '@/lib/utils';
import Button from '../components/Button';

const navLinks = [
  { to: '/', label: 'Home', title: 'Go to Home page' },
  { to: '/listen', label: 'Listen', title: 'Go to Listen page' },
  { to: '/about', label: 'About', title: 'Info about RG' },
  { to: '/contact', label: 'Contact', title: 'Contact RG' },
  { to: '/discography', label: 'Discography', title: 'View Discography' },
  { to: '/gallery', label: 'Gallery', title: 'View Gallery' },
];

const ChevronUp = React.createElement(
  BiSolidChevronUp as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { className: 'w-4 h-4', 'aria-hidden': 'true' }
);
const ChevronDown = React.createElement(
  BiSolidChevronDown as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { className: 'w-4 h-4', 'aria-hidden': 'true' }
);

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
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
    <header
      className={cn(
        "p-4 text-white text-center bg-black",
        className
      )}
    >
      <Link to="/">
        <img
          src="/images/logo.jpg"
          alt="Random Gorsey logo"
          title="Back to the Homepage"
          className={cn(
            "w-full h-auto m-0",
            isMobile && "block mx-auto mb-4"
          )}
        />
      </Link>
      <nav aria-label="Main navigation">
        {/* Desktop links */}
        {!isMobile && (
          <ul className="flex gap-[1.2rem] justify-center p-0 list-none">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  title={link.title}
                  className="font-['Tschick_Bold',sans-serif] text-[0.8rem] font-bold text-white no-underline hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {/* Mobile menu button */}
        {isMobile && (
          <>
            <Button
              variant="tertiary"
              className="flex gap-[0.4em] items-center justify-center px-[1em] py-[0.5em] font-bold cursor-pointer bg-transparent border-none text-white"
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
              <ul
                id="mobile-menu"
                className={cn(
                  "absolute top-full right-0 left-0 z-[1000]",
                  "flex flex-col items-center",
                  "py-[1em] px-0",
                  "bg-black border-t border-[#6c757d]",
                  "shadow-[0_2px_8px_rgb(0_0_0/20%)]",
                  "list-none"
                )}
              >
                {navLinks.map(link => (
                  <li key={link.to} className="my-[0.5em]">
                    <Link
                      to={link.to}
                      title={link.title}
                      onClick={() => setMenuOpen(false)}
                      className="font-['Tschick_Bold',sans-serif] text-[1.1em] font-bold text-white no-underline hover:underline"
                    >
                      {link.label}
                    </Link>
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
