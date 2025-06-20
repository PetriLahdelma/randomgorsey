import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders social links', () => {
    render(<Footer />);
    expect(screen.getByTitle('Bandcamp')).toBeInTheDocument();
  });
});
