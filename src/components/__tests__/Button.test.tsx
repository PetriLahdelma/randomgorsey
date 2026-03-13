import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders the button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-transparent');
  });

  it('handles the onClick event', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('applies the correct classes for secondary-dark variant', () => {
    render(<Button variant="secondary-dark">Dark</Button>);
    const button = screen.getByText('Dark');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('text-neutral-900');
    expect(button).toHaveClass('border-neutral-900');
  });

  it('handles onClick for secondary-dark variant', () => {
    const handleClick = vi.fn();
    render(<Button variant="secondary-dark" onClick={handleClick}>Dark</Button>);
    fireEvent.click(screen.getByText('Dark'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
