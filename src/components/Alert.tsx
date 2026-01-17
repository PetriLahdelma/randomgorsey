import React, { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Button from './Button'
import {
  XCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid'

const alertVariants = cva(
  'relative flex items-center gap-2 min-h-6 p-4 mb-4 font-sans',
  {
    variants: {
      variant: {
        info: 'bg-blue-600 text-white',
        success: 'bg-green-500 text-black',
        warning: 'bg-yellow-400 text-black',
        error: 'bg-pink-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const iconColorMap = {
  info: 'text-white',
  success: 'text-black',
  warning: 'text-black',
  error: 'text-white',
}

const iconMap = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: ExclamationCircleIcon,
}

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  children: React.ReactNode
  isCloseable?: boolean
  hasIcon?: boolean
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  isCloseable = false,
  hasIcon = false,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const IconComponent = iconMap[variant || 'info']

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {hasIcon && (
        <IconComponent
          className={cn('h-6 w-6 shrink-0', iconColorMap[variant || 'info'])}
        />
      )}
      <div className="flex-1">{children}</div>
      {isCloseable && (
        <Button
          variant="tertiary"
          className="ml-auto flex h-6 w-6 items-center justify-center bg-transparent border-none p-0"
          aria-label="Close alert"
          icon={
            <XCircleIcon
              className={cn('h-6 w-6', iconColorMap[variant || 'info'])}
            />
          }
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  )
}

export default Alert
export { Alert, alertVariants }
