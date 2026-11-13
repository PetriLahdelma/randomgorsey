import React from 'react'
import { cn } from '@/lib/utils'
import styles from './SystemPrimitives.module.css'

interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'figcaption' | 'span' | 'p'
}

const Caption: React.FC<CaptionProps> = ({
  as: Component = 'figcaption',
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        styles.caption,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Caption
export { Caption }
