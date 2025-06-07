import React from 'react';
import styles from './modal-overlay.module.css';

interface ModalOverlayUIProps {
  onClick: () => void;
}

export const ModalOverlayUI: React.FC<ModalOverlayUIProps> = ({ onClick }) => (
  <div data-cy='overlay' className={styles.overlay} onClick={onClick} />
);
