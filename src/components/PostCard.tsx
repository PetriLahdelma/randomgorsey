import React from "react";
import { Helmet } from "react-helmet-async";
import styles from "./PostCard.module.css";
import Avatar from "./Avatar";
import SocialShare from "./SocialShare";
import { BaseComponentProps } from "../types/common";
import { Surface, Heading, Text } from "./design-system";

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

  const cardClasses = [
    styles.card,
    post.featured ? styles.featured : "",
    onClick ? styles.clickable : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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

      <header className={styles.header}>
        <div className={styles["header-left"]}>
          <Heading level={2} as="h2" className={styles.title} tone={headingTone}>
            {post.title}
          </Heading>
          <div className={styles["avatar-author"]}>
            <Avatar avatarImage="/images/pete.jpg" size="M" />
            <Text as="span" variant="body" tone="contrast" className={styles.author}>
              {post.author}
            </Text>
          </div>
          {/* Date under author on mobile only */}
          <Text
            as="span"
            variant="bodySmall"
            tone={metaTone}
            className={styles["date-mobile"]}
          >
            {post.timestamp}
          </Text>
        </div>
        <div className={styles["header-right"]}>
          <Text<"time">
            as="time"
            variant="bodySmall"
            tone={metaTone}
            className={styles.time}
            dateTime={post.timestamp}
          >
            {post.timestamp}
          </Text>
          {showMetadata && (
            <div className={styles.metadata}>
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

      <div
        className={styles.body}
        dangerouslySetInnerHTML={{
          __html: displayBody,
        }}
      />

      <div className={styles["post-footer-row"]}>
        <div className={styles["read-more-mobile-wrap"]}>
          {hasLongContent && (
            <button
              onClick={toggleExpanded}
              className={styles["read-more"]}
              aria-expanded={expanded}
              aria-label={expanded ? "Show less content" : "Show more content"}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        {showSocialShare && (
          <div className={styles["post-footer-share"]}>
            <SocialShare url={postUrl} title={post.title} text={shareText} />
          </div>
        )}
      </div>

      {post.media && post.contentType === PostContentType.IMAGE && (
        <img
          src={post.media}
          alt={post.title}
          title={post.title}
          className={styles.media}
          loading="lazy"
        />
      )}

      {post.media && post.contentType === PostContentType.VIDEO && (
        <video
          src={post.media}
          controls
          className={styles.media}
          preload="metadata"
          aria-label={`Video: ${post.title}`}
        />
      )}

      {post.media && post.contentType === PostContentType.AUDIO && (
        <audio
          src={post.media}
          controls
          className={styles.media}
          preload="metadata"
          aria-label={`Audio: ${post.title}`}
        />
      )}
    </Surface>
  );
};

export default PostCard;
