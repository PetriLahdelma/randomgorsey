import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from '../Contact';

describe('Contact Page', () => {
  test('renders contact form', () => {
    render(<Contact />);

    const contactTitle = screen.getByText('Contact Us');
    expect(contactTitle).toBeInTheDocument();

    const contactForm = screen.getByRole('form');
    expect(contactForm).toBeInTheDocument();
  });
});
