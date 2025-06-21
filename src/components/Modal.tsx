import React from 'react';
import styles from './Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledById?: string;
  describedById?: string;
  closeable?: boolean;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, labelledById, describedById, closeable = true }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} data-testid="modal-overlay">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        aria-describedby={describedById}
      >
        {closeable && (
          <button className={styles.close} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
