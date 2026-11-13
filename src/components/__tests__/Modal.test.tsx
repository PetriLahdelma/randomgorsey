import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape when the dialog is closeable', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen onClose={handleClose}><p>Content</p></Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('keeps required decisions open when closeable is false', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen closeable={false} onClose={handleClose}><button type="button">Continue</button></Modal>);
    expect(screen.queryByRole('button', { name: 'Close modal' })).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not submit a parent form when close button is clicked', () => {
    const handleClose = vi.fn();
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <Modal isOpen onClose={handleClose}>
          <p>Content</p>
        </Modal>
      </form>
    );
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('moves focus into the dialog and restores it after close', async () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <>
        <button type="button">Trigger</button>
        <Modal isOpen={false} onClose={handleClose}><button type="button">First action</button></Modal>
      </>
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    trigger.focus();
    rerender(
      <>
        <button type="button">Trigger</button>
        <Modal isOpen onClose={handleClose}><button type="button">First action</button></Modal>
      </>
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus());
    rerender(
      <>
        <button type="button">Trigger</button>
        <Modal isOpen={false} onClose={handleClose}><button type="button">First action</button></Modal>
      </>
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus());
  });

  it('loops keyboard focus within the open dialog', async () => {
    render(<Modal isOpen onClose={() => {}}><button type="button">Continue</button></Modal>);
    const close = screen.getByRole('button', { name: 'Close modal' });
    const action = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(close).toHaveFocus());
    action.focus();
    fireEvent.keyDown(action, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(action).toHaveFocus();
  });

  it('preserves field focus and scroll lock when an inline close callback changes', async () => {
    const firstClose = vi.fn();
    const secondClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen onClose={() => firstClose()}>
        <input aria-label="Message" />
      </Modal>
    );
    const field = screen.getByRole('textbox', { name: 'Message' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus());
    field.focus();

    rerender(
      <Modal isOpen onClose={() => secondClose()}>
        <input aria-label="Message" />
      </Modal>
    );

    expect(field).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(firstClose).not.toHaveBeenCalled();
    expect(secondClose).toHaveBeenCalledTimes(1);
  });
});
