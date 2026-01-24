import React from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type SocialShareProps = {
  url: string;
  title?: string;
  text?: string;
  className?: string;
};

const SocialShare: React.FC<SocialShareProps> = ({ url, title, text, className }) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const menuId = React.useId();
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const shareText = text || title || "Check this out on Random Gorsey!";
  const shareUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const platforms = [
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodedText}`,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      name: "Reddit",
      url: `https://www.reddit.com/submit?url=${shareUrl}&title=${encodedText}`,
    },
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedText}%20${shareUrl}`,
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${shareUrl}&text=${encodedText}`,
    },
  ];

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: title || "Random Gorsey",
        text: shareText,
        url,
      });
    } catch {
      // User cancelled or share failed; no action needed.
    } finally {
      setOpen(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        window.prompt("Copy link", url);
      }
    } catch {
      window.prompt("Copy link", url);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-flex items-center", className)}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/80 p-2 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Share</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-white/15 bg-black/90 p-2 text-sm text-white shadow-xl backdrop-blur"
        >
          {canNativeShare && (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10"
              onClick={handleNativeShare}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share via device
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-white/10"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-300" aria-hidden="true" />
            ) : (
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? "Link copied" : "Copy link"}
          </button>
          <div className="my-1 h-px bg-white/10" aria-hidden="true" />
          {platforms.map((platform) => (
            <a
              key={platform.name}
              role="menuitem"
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded px-2 py-2 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Share on {platform.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialShare;
