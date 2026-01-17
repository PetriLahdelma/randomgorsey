import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export type AvatarProps = {
  avatarColor?: string
  avatarImage?: string
  initials?: string
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL'
  alt?: string
  className?: string
}

const sizeMap = {
  XS: 16,
  S: 20,
  M: 24,
  L: 32,
  XL: 56,
}

const sizeClasses = {
  XS: 'h-4 w-4 text-[8px]',
  S: 'h-5 w-5 text-[10px]',
  M: 'h-6 w-6 text-xs',
  L: 'h-8 w-8 text-sm',
  XL: 'h-14 w-14 text-2xl',
}

const Avatar: React.FC<AvatarProps> = ({
  avatarColor = '#000',
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
      <img
        src={avatarImage}
        alt={alt}
        onError={() => setImageError(true)}
        className={cn(
          'rounded-full object-cover bg-cover',
          sizeClasses[size],
          className
        )}
        style={{ backgroundColor: avatarColor }}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold text-white text-center',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: avatarColor }}
      aria-label={alt}
    >
      {initials}
    </div>
  )
}

export default Avatar
export { Avatar }
