import React, { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import styles from './SystemPrimitives.module.css'

export type AvatarProps = {
  avatarColor?: string
  avatarImage?: ImageProps['src']
  initials?: string
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  alt?: string
  className?: string
}

const sizeClasses = {
  XS: styles.avatarXs,
  S: styles.avatarSm,
  M: styles.avatarMd,
  L: styles.avatarLg,
  XL: styles.avatarXl,
}

const sizePixels = {
  XS: 16,
  S: 20,
  M: 24,
  L: 32,
  XL: 56,
} as const

const Avatar: React.FC<AvatarProps> = ({
  avatarColor,
  avatarImage,
  initials = 'RG',
  size = 'M',
  alt = 'User avatar',
  className,
}) => {
  const [imageError, setImageError] = useState(false)

  const showFallback = !avatarImage || imageError

  if (!showFallback) {
    return (
      <Image
        src={avatarImage}
        alt={alt}
        width={sizePixels[size]}
        height={sizePixels[size]}
        sizes={`${sizePixels[size]}px`}
        onError={() => setImageError(true)}
        className={cn(
          styles.avatar,
          styles.avatarImage,
          sizeClasses[size],
          className
        )}
        style={avatarColor ? { backgroundColor: avatarColor } : undefined}
      />
    )
  }

  return (
    <div
      className={cn(
        styles.avatar,
        sizeClasses[size],
        className
      )}
      style={avatarColor ? { backgroundColor: avatarColor } : undefined}
      aria-label={alt}
      role="img"
    >
      {initials}
    </div>
  )
}

export default Avatar
export { Avatar }
