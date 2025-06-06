import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  it('renders text', () => {
    render(<Badge text="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Badge text="Hot" variant="danger" />);
    expect(container.firstChild).toHaveClass('danger');
  });
});
