import React from "react";
import styles from "./SocialShare.module.css";
import { SocialIcon } from "react-social-icons";

export type SocialShareProps = {
  url: string;
  title?: string;
  text?: string;
};

const SocialShare: React.FC<SocialShareProps> = ({ url, title, text }) => {
  const shareText = encodeURIComponent(
    text || title || "Check this out on Random Gorsey!"
  );
  const shareUrl = encodeURIComponent(url);
  const platforms = [
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      network: "x",
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      network: "facebook",
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`,
      network: "reddit",
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      network: "whatsapp",
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
      network: "telegram",
    },
  ];
  return (
    <div className={styles["social-share"]}>
      <span className={styles.label}>Share:</span>
      {platforms.map((platform) => (
        <SocialIcon
          key={platform.name}
          url={platform.url}
          network={platform.network}
          bgColor="#000"
          fgColor="#fff"
          style={{ height: 24, width: 24 }}
          target="_blank"
          aria-label={`Share on ${platform.name}`}
          className={styles.icon}
        />
      ))}
    </div>
  );
};

export default SocialShare;
