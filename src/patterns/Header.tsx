import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidChevronUp, BiSolidChevronDown } from 'react-icons/bi';
import { IoCloseSharp } from 'react-icons/io5';
import { cn } from '@/lib/utils';
import Button from '../components/Button';

const navLinks = [
  { to: '/listen/', label: 'Listen', title: 'Listen to music' },
  { to: '/about/', label: 'About', title: 'About Random Gorsey' },
  { to: '/contact/', label: 'Contact', title: 'Get in touch' },
  { to: '/discography/', label: 'Discography', title: 'View releases' },
  { to: '/gallery/', label: 'Gallery', title: 'Photo gallery' },
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
  const pathname = usePathname();

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path.replace(/\/$/, ''));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto w-full max-w-5xl">
        <Link href="/" className="text-sm tracking-[0.25em] uppercase font-europa-light text-foreground no-underline hover:text-accent">
          Random Gorsey
        </Link>

        <nav aria-label="Main navigation">
          {!isMobile && (
            <ul className="flex gap-6 p-0 m-0 list-none">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    title={link.title}
                    className={cn(
                      "text-sm tracking-wide no-underline whitespace-nowrap",
                      isActive(link.to)
                        ? "text-accent underline underline-offset-4"
                        : "text-neutral-400 hover:text-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {isMobile && (
            <>
              <Button
                variant="tertiary"
                className="flex gap-1 items-center text-sm tracking-wide text-foreground bg-transparent border-none"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen(open => !open)}
                type="button"
                icon={menuOpen ? ChevronUp : ChevronDown}
              >
                Menu
              </Button>
              {menuOpen && (
                <div
                  id="mobile-menu"
                  className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8"
                >
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="absolute top-4 right-6 text-foreground hover:text-accent bg-transparent border-none cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IoCloseSharp className="w-8 h-8" aria-hidden="true" />
                  </button>
                  <Link
                    href="/"
                    title="Go to Home page"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "text-2xl tracking-wide no-underline",
                      isActive('/')
                        ? "text-accent underline underline-offset-4"
                        : "text-neutral-400 hover:text-accent"
                    )}
                  >
                    Home
                  </Link>
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      href={link.to}
                      title={link.title}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "text-2xl tracking-wide no-underline",
                        isActive(link.to)
                          ? "text-accent underline underline-offset-4"
                          : "text-neutral-400 hover:text-accent"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
