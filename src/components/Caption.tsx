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
      className={cn(
        'mt-2 italic text-center',
        // Use amber-300 for better readability while maintaining yellow aesthetic
        // On dark backgrounds: bright enough to read
        // On light backgrounds: darker amber provides contrast
        'text-amber-600 dark:text-amber-300',
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
