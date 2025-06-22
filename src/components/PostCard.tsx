import React from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './PostCard.module.css';
import Avatar from './Avatar';
import SocialShare from './SocialShare';
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
      <Helmet>
        <title>{post.title} | Random Gorsey</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.body.slice(0, 120) + (post.body.length > 120 ? '...' : '')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.origin + '/posts/' + post.id : ''} />
        <meta property="og:image" content={post.media && post.contentType === 'image' ? post.media : (typeof window !== 'undefined' ? window.location.origin + '/images/og.jpg' : 'https://randomgorsey.com/images/og.jpg')} />
      </Helmet>
      <header className={styles.header}>
        <div className={styles['header-left']}>
          <h2 className={styles.title}>{post.title}</h2>
          
            <div className={styles['avatar-author']}>
              <Avatar
              avatarImage="/images/pete.jpg"
              size='M'
            />
            <span className={styles.author}>{post.author}</span>
          </div>
        </div>
        <div className={styles['header-right']}>
          <time className={styles.time}>{post.timestamp}</time>
        </div>
      </header>
      <div
        className={styles.body}
        dangerouslySetInnerHTML={{
          __html: expanded ? post.body : `${post.body.slice(0, 200)}${hasLongContent ? '...' : ''}`
        }}
      />
      <div className={styles['post-footer-row']}>
        {hasLongContent && (
          <button onClick={toggleExpanded} className={styles['read-more']}>
            {expanded ? 'Show Less' : 'Read More'}
          </button>
        )}
        <div className={styles['post-footer-share']}>
          <SocialShare
            url={typeof window !== 'undefined' ? window.location.origin + '/posts/' + post.id : ''}
            title={post.title}
            text={post.body.slice(0, 120) + (post.body.length > 120 ? '...' : '')}
          />
        </div>
      </div>
      {post.media && post.contentType === 'image' && (
        <img src={post.media} alt={post.title} title={post.title} className={styles.media} />
      )}
      {post.media && post.contentType === 'video' && (
        <video src={post.media} controls className={styles.media} />
      )}
    </article>
  );
};

export default PostCard;
