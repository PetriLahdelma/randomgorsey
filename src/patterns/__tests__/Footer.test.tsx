import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders all social icon links', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Spotify')).toBeInTheDocument();
    expect(screen.getByLabelText('SoundCloud')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    expect(screen.getByLabelText('Bandcamp')).toBeInTheDocument();
  });

  it('renders copyright text with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`\u00A9 ${year} Random Gorsey`)).toBeInTheDocument();
  });

  it('opens social links in new tab', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('accepts custom className', () => {
    const { container } = render(<Footer className="custom-class" />);
    expect(container.querySelector('footer')).toHaveClass('custom-class');
  });
});
