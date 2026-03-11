import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  postCardVariants,
  postCardStagger,
  postCardChild,
} from "@/lib/motion";
import { usePerformance } from "@/lib/performance";
import { cn } from "@/lib/utils";
import SocialShare from "./SocialShare";
import { BaseComponentProps } from "../types/common";
import Heading from "./Heading";
import { toAbsoluteSiteUrl } from "../config/site";
import Lightbox from "./Lightbox";

/**
 * Post category for display labels
 */
export type PostCategory = 'studio' | 'playlist' | 'scene' | 'release' | 'field-recording' | 'recommendation';

export const categoryLabels: Record<PostCategory, string> = {
  'studio': 'STUDIO',
  'playlist': 'PLAYLIST',
  'scene': 'SCENE',
  'release': 'RELEASE',
  'field-recording': 'FIELD RECORDING',
  'recommendation': 'RECOMMENDATION',
};

/**
 * Supported content types for posts
 */
export enum PostContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  LINK = "link",
  PLAYLIST = "playlist",
}

/**
 * Post data structure
 */
export interface Post {
  /** Unique identifier for the post */
  id: number;
  /** Post title */
  title: string;
  /** Post publication timestamp */
  timestamp: string;
  /** Type of content */
  contentType: PostContentType | string;
  /** Post body content (HTML) */
  body: string;
  /** Media URL if applicable */
  media?: string;
  /** Intrinsic media width for optimized image rendering */
  mediaWidth?: number;
  /** Intrinsic media height for optimized image rendering */
  mediaHeight?: number;
  /** Background color for the post card */
  avatarColor?: string;
  /** Author name */
  author: string;
  /** Post excerpt for sharing */
  excerpt?: string;
  /** Post category for display label */
  category?: PostCategory;
  /** Post tags */
  tags?: string[];
  /** Whether the post is featured */
  featured?: boolean;
  /** View count */
  views?: number;
  /** Like count */
  likes?: number;
}

/**
 * Props for the PostCard component
 */
export interface PostCardProps extends Omit<BaseComponentProps, "children"> {
  /** Post data to display */
  post: Post;
  /** Position in the feed — determines entrance direction */
  index?: number;
  /** Whether to show full content initially */
  showFullContent?: boolean;
  /** Click handler for the entire card */
  onClick?: (post: Post) => void;
  /** Whether to show social sharing buttons */
  showSocialShare?: boolean;
  /** Maximum length before truncating content */
  truncateLength?: number;
  /** Whether to show metadata (views, likes, etc.) */
  showMetadata?: boolean;
  /** Heading level for the post title */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

function autoLinkUrls(html: string): string {
  const tagPattern = /<[^>]+>/g;
  const parts = html.split(tagPattern);
  const tags = html.match(tagPattern) || [];

  let result = "";
  let insideAnchorOrIframe = false;

  for (let i = 0; i < parts.length; i++) {
    let textPart = parts[i];

    if (!insideAnchorOrIframe) {
      textPart = textPart.replace(
        /(https?:\/\/[^\s<>"']+)/g,
        '<a href="$1" target="_blank" rel="noopener" class="text-accent underline underline-offset-4 hover:text-foreground transition-colors">$1</a>'
      );
    }

    result += textPart;

    if (i < tags.length) {
      const tag = tags[i];
      if (/<(a|iframe)\b/i.test(tag)) insideAnchorOrIframe = true;
      if (/<\/(a|iframe)>/i.test(tag)) insideAnchorOrIframe = false;
      result += tag;
    }
  }

  return result;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  if (iso.includes("T")) {
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}:00`;
  }

  return `${y}-${m}-${d}`;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  showFullContent = false,
  onClick,
  showSocialShare = true,
  truncateLength = 200,
  headingLevel = 2,
  className,
  style,
  id,
  testId,
  ...accessibilityProps
}) => {
  const { tier, isReducedMotion } = usePerformance();
  const shouldAnimate = tier >= 2 && !isReducedMotion;
  const [expanded, setExpanded] = React.useState(showFullContent);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [bodyImages, setBodyImages] = React.useState<string[]>([]);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  const toggleExpanded = React.useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleCardClick = React.useCallback(() => {
    onClick?.(post);
  }, [onClick, post]);

  const stripHtml = (value: string) =>
    value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const plainBody = stripHtml(post.body);
  const hasLongContent = post.body.length > truncateLength;
  const shouldShowReadMore = hasLongContent && !expanded;
  const displayBody = shouldShowReadMore
    ? `${plainBody.slice(0, truncateLength)}...`
    : post.body;

  React.useEffect(() => {
    if (bodyRef.current) {
      const imgs = bodyRef.current.querySelectorAll("img");
      const srcs = Array.from(imgs)
        .map((img) => img.src)
        .filter(Boolean);
      setBodyImages(srcs);
    }
  }, [expanded, displayBody]);

  const handleBodyClick = React.useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.stopPropagation();
        const src = (target as HTMLImageElement).src;
        const index = bodyImages.indexOf(src);
        if (index !== -1) {
          setLightboxIndex(index);
          setLightboxOpen(true);
        }
      }
    },
    [bodyImages]
  );

  const isCompactTitle = headingLevel >= 4;

  const postUrl = toAbsoluteSiteUrl(`/#post-${post.id}`);

  const shareText =
    post.excerpt ||
    plainBody.slice(0, 120) + (plainBody.length > 120 ? "..." : "");

  return (
    <motion.article
      custom={shouldAnimate ? (index !== undefined ? index % 2 === 1 : false) : undefined}
      variants={shouldAnimate ? postCardVariants : undefined}
      initial={shouldAnimate ? "hidden" : undefined}
      whileInView={shouldAnimate ? "visible" : undefined}
      viewport={{ once: true, margin: "-5% 0px" }}
      id={id}
      data-card
      className={cn(
        "bg-[oklch(8%_0_0deg)] card-signal p-8 mb-6 transition-colors hover:bg-[oklch(10%_0_0deg)] text-left",
        (onClick || shouldShowReadMore) && "cursor-pointer",
        className
      )}
      style={style}
      onClick={(e) => {
        // Don't expand if clicking on interactive elements inside
        const target = e.target as HTMLElement;
        if (target.closest("button, a, [role='menu']")) return;
        if (shouldShowReadMore) {
          toggleExpanded();
        } else if (onClick) {
          handleCardClick();
        }
      }}
      role={onClick || shouldShowReadMore ? "button" : "article"}
      tabIndex={onClick || shouldShowReadMore ? 0 : undefined}
      data-testid={testId}
      {...((onClick || shouldShowReadMore)
        ? {
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (shouldShowReadMore) {
                  toggleExpanded();
                } else if (onClick) {
                  handleCardClick();
                }
              }
            },
          }
        : {})}
      {...accessibilityProps}
    >
      <motion.div
        variants={shouldAnimate ? postCardStagger : undefined}
        initial={shouldAnimate ? "hidden" : undefined}
        whileInView={shouldAnimate ? "visible" : undefined}
        viewport={{ once: true }}
      >
        <motion.div variants={postCardChild}>
          {/* Category label */}
          {post.category && (
            <span className="font-mono-label text-xs text-accent tracking-[0.2em] uppercase block mb-1">
              {categoryLabels[post.category]}
            </span>
          )}

          {/* Date */}
          <time
            dateTime={post.timestamp}
            className="font-mono-label text-muted-foreground block mb-2"
          >
            {formatTimestamp(post.timestamp)}
          </time>
        </motion.div>

        <motion.div variants={postCardChild}>
          {/* Title */}
          <Heading
            level={headingLevel}
            className={cn(
              "m-0 mb-2 text-foreground",
              isCompactTitle && "text-[clamp(1.2rem,5vw,1.4rem)]"
            )}
            tone="light"
          >
            {post.title}
          </Heading>
        </motion.div>

        <motion.div variants={postCardChild}>
          {/* Body — animated expand/collapse */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={expanded ? "full" : "truncated"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.2 },
              }}
              style={{ overflow: "hidden" }}
            >
              <div
                ref={bodyRef}
                className={cn(
                  "mt-6 mb-3 font-europa text-[1.05rem] leading-[1.7] text-[oklch(65%_0_0deg)] [&>p]:mb-6 [&>p:last-child]:mb-0 [&_iframe]:w-full [&_iframe]:my-6 [&_iframe]:border-0 [&_iframe]:rounded-none [&_iframe]:bg-[oklch(6%_0_0deg)] [&_img]:cursor-zoom-in",
                  expanded && "noise-wipe-enter"
                )}
                onClick={handleBodyClick}
                dangerouslySetInnerHTML={{ __html: autoLinkUrls(displayBody) }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Read more + share */}
      <div className="flex flex-wrap gap-3 items-center mt-3">
        {hasLongContent && (
          <motion.button
            onClick={toggleExpanded}
            className="p-0 font-mono-label text-accent link-signal cursor-pointer bg-transparent border-none hover:text-foreground"
            aria-expanded={expanded}
            aria-label={expanded ? "Show less content" : "Show more content"}
            key={expanded ? "less" : "more"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {expanded ? "Show Less" : "Read More"}
          </motion.button>
        )}
        {showSocialShare && (
          <div className="ml-auto">
            <SocialShare url={postUrl} title={post.title} text={shareText} />
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && post.contentType === PostContentType.IMAGE && (
        <Image
          src={post.media}
          alt={post.title}
          title={post.title}
          width={post.mediaWidth ?? 1200}
          height={post.mediaHeight ?? 675}
          sizes="100vw"
          className="w-full mt-3"
        />
      )}
      {post.media && post.contentType === PostContentType.VIDEO && (
        <video
          src={post.media}
          controls
          className="w-full mt-3"
          preload="metadata"
          aria-label={`Video: ${post.title}`}
        />
      )}
      {post.media && post.contentType === PostContentType.AUDIO && (
        <audio
          src={post.media}
          controls
          className="w-full mt-3"
          preload="metadata"
          aria-label={`Audio: ${post.title}`}
        />
      )}

      {lightboxOpen && bodyImages.length > 0 && (
        <Lightbox
          images={bodyImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </motion.article>
  );
};

export default PostCard;
