import React from "react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";
import SocialShare from "./SocialShare";
import { BaseComponentProps } from "../types/common";
import Surface from "./Surface";
import Heading from "./Heading";
import Text from "./Text";

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
  /** Background color for the post card */
  avatarColor?: string;
  /** Author name */
  author: string;
  /** Post excerpt for sharing */
  excerpt?: string;
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
}

/**
 * PostCard component for displaying blog post content with social sharing
 *
 * @example
 * ```tsx
 * <PostCard
 *   post={postData}
 *   showFullContent={false}
 *   onClick={(post) => navigate(`/post/${post.id}`)}
 * />
 *
 * <PostCard
 *   post={featuredPost}
 *   showFullContent={true}
 *   showSocialShare={true}
 *   truncateLength={300}
 * />
 * ```
 */
const PostCard: React.FC<PostCardProps> = ({
  post,
  showFullContent = false,
  onClick,
  showSocialShare = true,
  truncateLength = 200,
  showMetadata = false,
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

  const hasLongContent = post.body.length > truncateLength;
  const shouldShowReadMore = hasLongContent && !expanded;
  const displayBody = shouldShowReadMore
    ? `${post.body.slice(0, truncateLength)}...`
    : post.body;

  const cardClasses = cn(
    "mb-6",
    post.featured && "border-white/[0.45]",
    onClick && "cursor-pointer focus-visible:outline-2 focus-visible:outline-[#ff0] focus-visible:outline-offset-[3px]",
    className
  );

  const surfaceVariant = post.featured ? "inverted" : "flat";
  const surfaceStyle = {
    ...(post.avatarColor ? { backgroundColor: post.avatarColor } : {}),
    ...style,
  };
  const headingTone = "light";
  const metaTone = "contrast";
  const isInteractive = Boolean(onClick);

  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/posts/${post.id}`
      : `https://randomgorsey.com/posts/${post.id}`;

  const shareText =
    post.excerpt ||
    post.body.slice(0, 120) + (post.body.length > 120 ? "..." : "");

  return (
    <Surface
      as="article"
      id={id}
      className={cardClasses}
      style={surfaceStyle}
      onClick={onClick ? handleCardClick : undefined}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      data-testid={testId}
      interactive={isInteractive}
      variant={surfaceVariant}
      padding="lg"
      {...(onClick
        ? {
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            },
          }
        : {})}
      {...accessibilityProps}
    >
      <Helmet>
        <title>{post.title} | Random Gorsey</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={shareText} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta
          property="og:image"
          content={
            post.media && post.contentType === PostContentType.IMAGE
              ? post.media
              : typeof window !== "undefined"
              ? `${window.location.origin}/images/og.jpg`
              : "https://randomgorsey.com/images/og.jpg"
          }
        />
        {post.tags && post.tags.length > 0 && (
          <meta name="keywords" content={post.tags.join(", ")} />
        )}
      </Helmet>

      {/* Header section */}
      <header className="flex flex-wrap gap-4 items-start justify-between mb-4">
        {/* Left side: title, avatar, author */}
        <div className="flex flex-col gap-[0.35rem] items-start text-left flex-[1_1_60%] min-w-[240px] max-md:flex-[1_1_100%]">
          <Heading
            level={2}
            as="h2"
            className="m-0"
            tone={headingTone}
          >
            {post.title}
          </Heading>
          <div className="flex flex-row gap-2 items-center">
            <Avatar avatarImage="/images/pete.jpg" size="M" />
            <Text
              as="span"
              variant="body"
              tone="contrast"
              className="text-base tracking-[0.04em]"
            >
              {post.author}
            </Text>
          </div>
          {/* Date under author on mobile only */}
          <Text
            as="span"
            variant="bodySmall"
            tone={metaTone}
            className="hidden max-md:block mt-[0.2em] ml-[2.2em] text-[0.9rem] text-[#6c757d]"
          >
            {post.timestamp}
          </Text>
        </div>

        {/* Right side: time and metadata */}
        <div className="flex flex-col gap-[0.45rem] items-end text-right flex-[0_0_200px] max-md:flex-[1_1_100%] max-md:items-start max-md:text-left max-md:gap-1">
          <Text
            as="time"
            variant="bodySmall"
            tone={metaTone}
            className="text-[0.95rem] text-left max-md:hidden"
            dateTime={post.timestamp}
          >
            {post.timestamp}
          </Text>
          {showMetadata && (
            <div className="flex flex-col gap-1 items-end text-[0.85rem] uppercase tracking-[0.05em] max-md:items-start">
              {post.views && (
                <Text as="span" variant="caption" tone={metaTone}>
                  {post.views} views
                </Text>
              )}
              {post.likes && (
                <Text as="span" variant="caption" tone={metaTone}>
                  {post.likes} likes
                </Text>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Body content */}
      <div
        className="mt-4 mb-3 font-['Europa_Regular',sans-serif] text-[1.05rem] leading-[1.7]"
        dangerouslySetInnerHTML={{
          __html: displayBody,
        }}
      />

      {/* Footer row: Read more and social share */}
      <div className="flex flex-wrap gap-3 items-center justify-between mt-3 max-md:flex-col max-md:gap-[0.35rem] max-md:items-center">
        <div className="max-md:flex max-md:justify-center max-md:order-1 max-md:w-full max-md:mb-1 max-md:text-center">
          {hasLongContent && (
            <button
              onClick={toggleExpanded}
              className="p-0 mr-2 font-['Europa_Regular',sans-serif] text-base font-bold text-inherit underline cursor-pointer bg-transparent border-none"
              aria-expanded={expanded}
              aria-label={expanded ? "Show less content" : "Show more content"}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {showSocialShare && (
          <div className="ml-auto max-md:flex max-md:justify-center max-md:order-2 max-md:w-full max-md:ml-0 max-md:text-center">
            <SocialShare url={postUrl} title={post.title} text={shareText} />
          </div>
        )}
      </div>

      {/* Media content */}
      {post.media && post.contentType === PostContentType.IMAGE && (
        <img
          src={post.media}
          alt={post.title}
          title={post.title}
          className="w-full mt-2 rounded"
          loading="lazy"
        />
      )}

      {post.media && post.contentType === PostContentType.VIDEO && (
        <video
          src={post.media}
          controls
          className="w-full mt-2 rounded"
          preload="metadata"
          aria-label={`Video: ${post.title}`}
        />
      )}

      {post.media && post.contentType === PostContentType.AUDIO && (
        <audio
          src={post.media}
          controls
          className="w-full mt-2 rounded"
          preload="metadata"
          aria-label={`Audio: ${post.title}`}
        />
      )}
    </Surface>
  );
};

export default PostCard;
