import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  labelledById?: string
  describedById?: string
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
  closeable = true,
  className,
  overlayClassName,
}) => {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeable) {
        onClose()
      }
    },
    [onClose, closeable]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeable) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop/Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClick}
            data-testid="modal-overlay"
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center bg-black/80',
              overlayClassName
            )}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledById}
              aria-describedby={describedById}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'relative p-8 bg-white text-black rounded-lg shadow-lg font-sans',
                className
              )}
            >
              {closeable && (
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-2 right-2 text-2xl font-bold text-blue-600 bg-transparent border-none cursor-pointer hover:opacity-70"
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
