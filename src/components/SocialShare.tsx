import React from 'react';
import styles from './SocialShare.module.css';
import { SocialIcon } from 'react-social-icons';

export type SocialShareProps = {
  url: string;
  title?: string;
  text?: string;
};

const SocialShare: React.FC<SocialShareProps> = ({ url, title, text }) => {
  const shareText = encodeURIComponent(text || title || 'Check this out on Random Gorsey!');
  const shareUrl = encodeURIComponent(url);
  const platforms = [
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      network: 'x',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      network: 'facebook',
    },
    {
      name: 'Reddit',
      url: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`,
      network: 'reddit',
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      network: 'whatsapp',
    },
  ];
  return (
    <div className={styles.socialShare}>
      <span className={styles.label}>Share:</span>
      {platforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          className={styles.icon}
        >
          <SocialIcon network={platform.network} style={{ height: 24, width: 24 }} />
        </a>
      ))}
    </div>
  );
};

export default SocialShare;
