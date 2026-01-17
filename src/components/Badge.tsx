import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-block px-2 py-1 font-sans text-xs font-semibold uppercase tracking-wider rounded',
  {
    variants: {
      variant: {
        default: 'bg-gray-300 text-black',
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-transparent text-blue-600 border border-blue-600',
        tertiary: 'bg-gray-100 text-blue-600',
        success: 'bg-green-500 text-black',
        danger: 'bg-red-600 text-white',
      },
      disabled: {
        true: 'bg-gray-200 text-gray-500 cursor-not-allowed',
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
    aria-disabled={disabled ?? undefined}
    {...props}
  >
    {text}
  </span>
)

export default Badge
export { Badge, badgeVariants }
