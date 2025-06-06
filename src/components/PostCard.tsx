import React from 'react';
import styles from './PostCard.module.css';

export type Post = {
  id: number;
  title: string;
  timestamp: string;
  contentType: string;
  body: string;
  media?: string;
  avatarColor?: string;
};

type PostCardProps = {
  post: Post;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded((e) => !e);
  const hasLongContent = post.body.length > 200;
  return (
    <article
      className={styles.card}
      style={{ backgroundColor: post.avatarColor || '#fff', color: '#000' }}
    >
      <header className={styles.header}>
        <div
          className={styles.avatar}
          style={{ backgroundColor: post.avatarColor || '#000' }}
        ></div>
        <div>
          <h3 className={styles.title}>{post.title}</h3>
          <time className={styles.time}>{post.timestamp}</time>
        </div>
        <span className={styles.type}>{post.contentType}</span>
      </header>
      <div className={styles.body}>
        {expanded ? post.body : `${post.body.slice(0, 200)}${hasLongContent ? '...' : ''}`}
      </div>
      {hasLongContent && (
        <button onClick={toggleExpanded} className={styles.readMore}>
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
      {post.media && post.contentType === 'image' && (
        <img src={post.media} alt="" className={styles.media} />
      )}
      {post.media && post.contentType === 'video' && (
        <video src={post.media} controls className={styles.media} />
      )}
    </article>
  );
};

export default PostCard;
