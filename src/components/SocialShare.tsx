import React from "react";
import { cn } from "@/lib/utils";
import { SocialIcon } from "react-social-icons";

export type SocialShareProps = {
  url: string;
  title?: string;
  text?: string;
  className?: string;
};

const SocialShare: React.FC<SocialShareProps> = ({ url, title, text, className }) => {
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
    <div className={cn("flex gap-2 items-center my-4", className)}>
      <span className="mr-2 font-bold text-inherit">Share:</span>
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
          className="p-0 m-0 text-2xl text-inherit no-underline bg-transparent shadow-none transition-transform duration-150 hover:scale-[1.2]"
        />
      ))}
    </div>
  );
};

export default SocialShare;
