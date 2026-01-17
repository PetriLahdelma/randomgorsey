import React from 'react'
import { cn } from '@/lib/utils'

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
      className={cn('mt-2 italic text-yellow-400 text-center', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Caption
export { Caption }
