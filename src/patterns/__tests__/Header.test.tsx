import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders navigation', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
    expect(screen.getByTitle('Go to Home page')).toBeInTheDocument();
  });
});
