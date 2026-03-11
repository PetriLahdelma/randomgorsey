import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/layout/Container';
import { FaSpotify, FaSoundcloud, FaInstagram, FaYoutube, FaBandcamp } from 'react-icons/fa';

const socialLinks = [
  { label: 'Spotify', href: 'https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg', icon: <FaSpotify size={20} /> },
  { label: 'SoundCloud', href: 'https://soundcloud.com/randomgorsey', icon: <FaSoundcloud size={20} /> },
  { label: 'Instagram', href: 'https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr', icon: <FaInstagram size={20} /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@randomgorsey8125', icon: <FaYoutube size={20} /> },
  { label: 'Bandcamp', href: 'https://randomgorsey.bandcamp.com', icon: <FaBandcamp size={20} /> },
];

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("border-t border-neutral-800 py-8", className)}>
      <Container size="sm" padding="md">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            {socialLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-accent transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
          <p className="text-neutral-600 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Random Gorsey
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
