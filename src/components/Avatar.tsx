import React from 'react';
import styles from './Avatar.module.css';

export type AvatarProps = {
  avatarColor?: string;
  avatarImage?: string;
  initials?: string;
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  alt?: string;
};

const sizeMap = {
  XS: 16,
  S: 20,
  M: 24,
  L: 32,
  XL: 56,
};

const Avatar: React.FC<AvatarProps> = ({ avatarColor = '#000', avatarImage, initials = 'RG', size = 'M', alt = 'User avatar' }) => {
  const dimension = sizeMap[size] || 24;
  if (avatarImage) {
    return (
      <img
        src={avatarImage}
        alt={alt}
        className={styles['avatar-image']}
        style={{
          width: dimension,
          height: dimension,
          backgroundColor: avatarColor,
          objectFit: 'cover',
          fontSize: dimension * 0.5,
        }}
      />
    );
  }
  return (
    <div
      className={styles.avatar}
      aria-label={alt}
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: avatarColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontSize: dimension * 0.5,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
