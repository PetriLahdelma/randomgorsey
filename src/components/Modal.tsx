import React, { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, overlayVariants, modalVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'
import styles from './SystemPrimitives.module.css'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  labelledById?: string
  describedById?: string
  ariaLabel?: string
  closeable?: boolean
  className?: string
  overlayClassName?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  labelledById,
  describedById,
  ariaLabel,
  closeable = true,
  className,
  overlayClassName,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const closeableRef = useRef(closeable)

  useEffect(() => {
    onCloseRef.current = onClose
    closeableRef.current = closeable
  }, [onClose, closeable])

  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeableRef.current) {
      onCloseRef.current()
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null
      const previousOverflow = document.body.style.overflow
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      const focusTimer = window.setTimeout(() => {
        const firstControl = dialogRef.current?.querySelector<HTMLElement>(focusableSelector)
        ;(firstControl ?? dialogRef.current)?.focus({ preventScroll: true })
      }, 0)

      return () => {
        window.clearTimeout(focusTimer)
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = previousOverflow
        previouslyFocusedRef.current?.focus({ preventScroll: true })
      }
    }

    return undefined
  }, [isOpen, handleEscape])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeable) {
      onClose()
    }
  }

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return

    const controls = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    )

    if (controls.length === 0) {
      event.preventDefault()
      dialogRef.current.focus()
      return
    }

    const first = controls[0]
    const last = controls[controls.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop/Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            onClick={handleOverlayClick}
            data-testid="modal-overlay"
            className={cn(
              styles.modalOverlay,
              overlayClassName
            )}
          >
            {/* Modal Content */}
            <motion.div
              variants={modalVariants}
              ref={dialogRef}
              initial="initial"
              animate="enter"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledById}
              aria-label={labelledById ? undefined : (ariaLabel ?? 'Dialog')}
              aria-describedby={describedById}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleDialogKeyDown}
              className={cn(
                styles.modalPanel,
                className
              )}
            >
              {closeable && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className={styles.modalClose}
                >
                  ×
                </button>
              )}
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
export { Modal }
