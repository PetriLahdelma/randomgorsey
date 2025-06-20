import React from 'react';
import { render, screen } from '@testing-library/react';
import Discography from '../Discography';

describe('Discography Page', () => {
  test('renders release information', () => {
    render(<Discography />);
    expect(screen.getByText('Discography')).toBeInTheDocument();
    expect(screen.getByText('So Long Spectrum')).toBeInTheDocument();
    expect(screen.getByText(/FIRGO2100004/)).toBeInTheDocument();
    expect(screen.getByText('The Customer is Always Right EP')).toBeInTheDocument();
    expect(screen.getByText(/RDGY 01/)).toBeInTheDocument();
  });
});
