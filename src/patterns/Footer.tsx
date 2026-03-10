import React from 'react';
import { cn } from '@/lib/utils';

const socialLinks = [
  { label: 'SP', title: 'Spotify', url: 'https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg' },
  { label: 'SC', title: 'Soundcloud', url: 'https://soundcloud.com/randomgorsey' },
  { label: 'IG', title: 'Instagram', url: 'https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr' },
  { label: 'YT', title: 'YouTube', url: 'https://www.youtube.com/@randomgorsey8125' },
  { label: 'BC', title: 'Bandcamp', url: 'https://randomgorsey.bandcamp.com' },
];

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "sticky bottom-0 z-[1000]",
        "px-6 py-3",
        "mt-auto",
        "border-t border-border",
        "bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between mx-auto max-w-5xl">
        <span className="font-mono-label text-muted-foreground">
          &copy; {new Date().getFullYear()} Random Gorsey
        </span>
        <div className="flex gap-5">
          {socialLinks.map(link => (
            <a
              key={link.label}
              href={link.url}
              title={link.title}
              aria-label={link.title}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label text-muted-foreground hover:text-accent no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
