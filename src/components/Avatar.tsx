import React from 'react';
import styles from './Avatar.module.css';

export type AvatarProps = {
  avatarColor?: string;
  avatarImage?: string;
  initials?: string;
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
};

const sizeMap = {
  XS: 16,
  S: 20,
  M: 24,
  L: 32,
  XL: 56,
};

const Avatar: React.FC<AvatarProps> = ({ avatarColor = '#000', avatarImage, initials = 'RG', size = 'M' }) => {
  const dimension = sizeMap[size] || 24;
  return (
    <div
      className={avatarImage ? styles['avatar-image'] : styles.avatar}
      aria-label="User avatar"
      style={{
        width: dimension,
        height: dimension,
        backgroundImage: avatarImage ? `url(${avatarImage})` : undefined,
        backgroundColor: !avatarImage ? avatarColor : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontSize: dimension * 0.5,
      }}
    >
      {!avatarImage && initials}
    </div>
  );
};

export default Avatar;
