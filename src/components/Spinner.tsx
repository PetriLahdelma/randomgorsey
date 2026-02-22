import React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
  ariaLabel?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  ariaLabel = 'Loading',
}) => {
  // Handle numeric size for backwards compatibility
  const isNumericSize = typeof size === 'number'
  const sizeStyle = isNumericSize
    ? { width: size, height: size }
    : undefined
  const sizeClass = isNumericSize ? 'border-4' : sizeClasses[size]

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-black/10 border-t-black mx-auto',
        sizeClass,
        className
      )}
      style={sizeStyle}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}

export default Spinner
export { Spinner }
