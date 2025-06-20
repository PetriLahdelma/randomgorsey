import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Pattern', () => {
  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Listen')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Discography')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });
});
