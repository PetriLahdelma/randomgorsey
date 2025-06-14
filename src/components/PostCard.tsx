import React from 'react';
import styles from './PostCard.module.css';
import Avatar from './Avatar';
export type Post = {
  id: number;
  title: string;
  timestamp: string;
  contentType: string;
  body: string;
  media?: string;
  avatarColor?: string;
  author: string;
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
        <div className={styles['header-left']}>
          <h3 className={styles.title}>{post.title}</h3>
          
            <div className={styles['avatar-author']}>
              <Avatar
              avatarImage="/images/pete.jpg"
            />
            <span className={styles.author}>{post.author}</span>
          </div>
        </div>
        <div className={styles['header-right']}>
          <time className={styles.time}>{post.timestamp}</time>
        </div>
      </header>
      <div className={styles.body}>
        {expanded ? post.body : `${post.body.slice(0, 200)}${hasLongContent ? '...' : ''}`}
      </div>
      {hasLongContent && (
        <button onClick={toggleExpanded} className={styles['read-more']}>
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
      {post.media && post.contentType === 'image' && (
        <img src={post.media} alt={post.title} className={styles.media} />
      )}
      {post.media && post.contentType === 'video' && (
        <video src={post.media} controls className={styles.media} />
      )}
    </article>
  );
};

export default PostCard;
