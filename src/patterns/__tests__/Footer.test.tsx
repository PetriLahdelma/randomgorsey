import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Pattern', () => {
  it('renders copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/Random Gorsey/i)).toBeInTheDocument();
  });
});
