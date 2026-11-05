"use client";

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
import DeferredPostBody from "./DeferredPostBody";
import {
  categoryLabels,
  PostContentType,
  type Post,
} from "@/content/post-types";

export {
  categoryLabels,
  PostContentType,
  type Post,
  type PostCategory,
} from "@/content/post-types";

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
  /** Optional action exposed through the post title control */
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
  const [date, time] = iso.split("T");

  if (time) {
    return `${date} ${time.slice(0, 5)}:00`;
  }

  return date;
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
  const { tier, isReducedMotion, effectsEnabled } = usePerformance();
  const shouldAnimate =
    effectsEnabled && tier >= 2 && !isReducedMotion;
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

  const postUrl = toAbsoluteSiteUrl(`/posts/${post.id}/`);

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
        className
      )}
      style={style}
      data-testid={testId}
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
              "m-0 mb-2 font-europa tracking-normal text-foreground",
              isCompactTitle && "text-[clamp(1.2rem,5vw,1.4rem)]"
            )}
            tone="light"
            uppercase={false}
          >
            {onClick ? (
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent p-0 text-left font-inherit text-inherit"
                onClick={handleCardClick}
              >
                {post.title}
              </button>
            ) : (
              post.title
            )}
          </Heading>
        </motion.div>

        <motion.div variants={postCardChild}>
          {/* Body — animated expand/collapse */}
          <AnimatePresence
            initial={false}
            mode={shouldAnimate ? "wait" : "sync"}
          >
            <motion.div
              key={expanded ? "full" : "truncated"}
              initial={shouldAnimate ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: "auto" }}
              exit={shouldAnimate ? { opacity: 0, height: 0 } : undefined}
              transition={
                shouldAnimate
                  ? {
                      height: {
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.2 },
                    }
                  : { duration: 0 }
              }
              style={{ overflow: "hidden" }}
            >
              <DeferredPostBody
                ref={bodyRef}
                className={cn(
                  "mt-6 mb-3 font-europa text-[1.05rem] leading-[1.7] text-[oklch(65%_0_0deg)]",
                  "[&_.postBodySegment>p]:mb-6 [&_.postBodySegment>p:last-child]:mb-0 [&_img]:cursor-zoom-in",
                  expanded && shouldAnimate && "noise-wipe-enter"
                )}
                onClick={handleBodyClick}
                html={autoLinkUrls(displayBody)}
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
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldAnimate ? 0.2 : 0 }}
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
