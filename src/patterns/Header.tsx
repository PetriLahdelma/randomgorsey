import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidChevronUp, BiSolidChevronDown } from 'react-icons/bi';
import { cn } from '@/lib/utils';
import Button from '../components/Button';

const navLinks = [
  { to: '/', label: 'Home', title: 'Go to Home page' },
  { to: '/listen/', label: 'Listen', title: 'Go to Listen page' },
  { to: '/about/', label: 'About', title: 'Info about RG' },
  { to: '/contact/', label: 'Contact', title: 'Contact RG' },
  { to: '/discography/', label: 'Disco', title: 'View Discography' },
  { to: '/gallery/', label: 'Gallery', title: 'View Gallery' },
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
        "relative border-b border-border",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto w-full max-w-5xl">
        <Link href="/" className="font-tschick-bold text-lg text-foreground uppercase tracking-[0.05em] no-underline hover:text-accent">
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
                      "font-mono-label no-underline whitespace-nowrap",
                      isActive(link.to)
                        ? "text-accent underline underline-offset-4"
                        : "text-muted-foreground hover:text-foreground"
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
                className="flex gap-1 items-center font-mono-label text-foreground bg-transparent border-none"
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
                <ul
                  id="mobile-menu"
                  className={cn(
                    "absolute top-full right-0 left-0 z-[1000]",
                    "flex flex-col items-center",
                    "py-4 px-0 m-0",
                    "bg-background border-t border-border",
                    "list-none"
                  )}
                >
                  {navLinks.map(link => (
                    <li key={link.to} className="my-2">
                      <Link
                        href={link.to}
                        title={link.title}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "font-mono-label text-sm no-underline",
                          isActive(link.to)
                            ? "text-accent underline underline-offset-4"
                            : "text-muted-foreground hover:text-foreground"
                        )}
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
      </div>
    </header>
  );
};

export default Header;
