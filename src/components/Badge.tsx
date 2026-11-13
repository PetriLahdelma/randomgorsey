import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import styles from './SystemPrimitives.module.css'

const badgeVariants = cva(
  styles.badge,
  {
    variants: {
      variant: {
        default: styles.badgeDefault,
        primary: styles.badgePrimary,
        secondary: styles.badgeSecondary,
        tertiary: styles.badgeTertiary,
        success: styles.badgeSuccess,
        danger: styles.badgeDanger,
      },
      disabled: {
        true: styles.badgeDisabled,
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      disabled: false,
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  text: string
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  disabled = false,
  className,
  ...props
}) => (
  <span
    className={cn(badgeVariants({ variant, disabled }), className)}
    aria-disabled={disabled || undefined}
    {...props}
  >
    {text}
  </span>
)

export default Badge
export { Badge, badgeVariants }
