import React from 'react';
import styles from './Avatar.module.css';

export type AvatarProps = {
  avatarColor?: string;
  avatarImage?: string;
  initials?: string;
};

const Avatar: React.FC<AvatarProps> = ({ avatarColor = '#000', avatarImage, initials = 'RG' }) => {
  return (
    <div
      className={avatarImage ? styles['avatar-image'] : styles.avatar}
      style={avatarImage ? { backgroundImage: `url(${avatarImage})` } : { backgroundColor: avatarColor }}
    >
      {!avatarImage && initials}
    </div>
  );
};

export default Avatar;
