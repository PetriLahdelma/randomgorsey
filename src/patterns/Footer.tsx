import React from 'react';
import { SocialIcon } from 'react-social-icons';
import { SiBandcamp } from "react-icons/si";
import { cn } from '@/lib/utils';

const BandcampIcon = SiBandcamp as React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "sticky bottom-0 z-[1000]",
        "p-4 max-md:p-[0.2rem]",
        "mt-auto",
        "font-europa",
        "text-white text-center text-sm",
        "bg-black",
        className
      )}
    >
      <div className="flex gap-3 justify-center mt-4 items-center">
        <SocialIcon
          label="Spotify"
          url="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg"
          bgColor="#000"
          fgColor="#fff"
          style={{ width: '2rem', height: '2rem' }}
          title="Spotify"
        />
        <SocialIcon
          label="Soundcloud"
          url="https://soundcloud.com/randomgorsey"
          bgColor="#000"
          fgColor="#fff"
          style={{ width: '2rem', height: '2rem' }}
          title="Soundcloud"
        />
        <SocialIcon
          label="Instagram"
          url="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr"
          bgColor="#000"
          fgColor="#fff"
          style={{ width: '2rem', height: '2rem' }}
          title="Instagram"
        />
        <SocialIcon
          label="YouTube"
          url="https://www.youtube.com/@randomgorsey8125"
          bgColor="#000"
          fgColor="#fff"
          style={{ width: '2rem', height: '2rem' }}
          title="YouTube"
        />
        <a
          className="flex items-center justify-center w-8 h-8"
          href='https://randomgorsey.bandcamp.com'
          title="Bandcamp"
          aria-label="Bandcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BandcampIcon
            className="block w-5 h-5 m-auto"
            style={{ color: '#fff' }}
          />
        </a>
      </div>
      <p className="inline-flex items-center text-white">
        &copy; {new Date().getFullYear()} &nbsp;Random Gorsey. Rights reserved.&nbsp;
        <a
          href="https://www.instagram.com/digitaltableteur"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center no-underline text-white"
        >
          <span
            title="Site by Digitaltableteur"
            className="inline max-md:hidden"
          >
            Site by
          </span>
          <img
            src="/images/dt.svg"
            title="Site by Digitaltableteur"
            alt="Digitaltableteur"
            className="w-[1.2rem] h-[1.2rem] ml-[0.3rem] invert"
          />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
