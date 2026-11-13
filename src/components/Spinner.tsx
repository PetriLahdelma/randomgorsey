import React from 'react'
import { cn } from '@/lib/utils'
import styles from './SystemPrimitives.module.css'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number
  className?: string
  ariaLabel?: string
}

const sizeClasses = {
  sm: styles.spinnerSm,
  md: styles.spinnerMd,
  lg: styles.spinnerLg,
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
  const sizeClass = isNumericSize ? styles.spinnerMd : sizeClasses[size]

  return (
    <div
      className={cn(
        styles.spinner,
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
