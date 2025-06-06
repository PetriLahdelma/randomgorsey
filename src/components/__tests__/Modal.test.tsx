import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal Component', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
