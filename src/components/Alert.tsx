import React, { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import styles from './SystemPrimitives.module.css'
import {
  XCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid'

const alertVariants = cva(
  styles.alert,
  {
    variants: {
      variant: {
        info: styles.alertInfo,
        success: styles.alertSuccess,
        warning: styles.alertWarning,
        error: styles.alertError,
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

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
          className={styles.alertIcon}
          aria-hidden="true"
        />
      )}
      <div className={styles.alertContent}>{children}</div>
      {isCloseable && (
        <button
          type="button"
          className={styles.dismiss}
          aria-label="Close alert"
          onClick={() => setIsVisible(false)}
        >
          <XCircleIcon className={styles.dismissIcon} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default Alert
export { Alert, alertVariants }
