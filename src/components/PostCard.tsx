import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SocialShare from "./SocialShare";
import { BaseComponentProps } from "../types/common";
import Heading from "./Heading";
import { toAbsoluteSiteUrl } from "../config/site";

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

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();

  if (iso.includes("T")) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${month} ${day}, ${year} — ${displayHours}:${displayMinutes} ${ampm}`;
  }

  return `${month} ${day}, ${year}`;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  showFullContent = false,
  onClick,
  showSocialShare = true,
  truncateLength = 200,
  showMetadata: _showMetadata = false,
  headingLevel = 2,
  className,
  style,
  id,
  testId,
  ...accessibilityProps
}) => {
  const [expanded, setExpanded] = React.useState(showFullContent);

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

  const isCompactTitle = headingLevel >= 4;

  const postUrl = toAbsoluteSiteUrl(`/#post-${post.id}`);

  const shareText =
    post.excerpt ||
    plainBody.slice(0, 120) + (plainBody.length > 120 ? "..." : "");

  return (
    <article
      id={id}
      className={cn(
        "bg-[oklch(8%_0_0deg)] border border-[oklch(12%_0_0deg)] p-8 mb-6 transition-colors hover:bg-[oklch(10%_0_0deg)] text-left",
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
            className="mt-6 mb-3 font-europa text-[1.05rem] leading-[1.7] text-[oklch(65%_0_0deg)] [&>p]:mb-6 [&>p:last-child]:mb-0 [&_iframe]:w-full [&_iframe]:my-6 [&_iframe]:border-0 [&_iframe]:rounded-none [&_iframe]:bg-[oklch(6%_0_0deg)]"
            dangerouslySetInnerHTML={{ __html: displayBody }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Read more + share */}
      <div className="flex flex-wrap gap-3 items-center mt-3">
        {hasLongContent && (
          <motion.button
            onClick={toggleExpanded}
            className="p-0 font-mono-label text-accent underline underline-offset-4 cursor-pointer bg-transparent border-none hover:text-foreground"
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
    </article>
  );
};

export default PostCard;
