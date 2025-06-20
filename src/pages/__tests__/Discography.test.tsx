import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Discography from '../Discography';

describe('Discography Page', () => {
  it('lists releases', () => {
    render(
      <HelmetProvider>
        <Discography />
      </HelmetProvider>
    );
    expect(screen.getByRole('heading', { name: /Discography/i })).toBeInTheDocument();
    expect(screen.getByText('So Long Spectrum')).toBeInTheDocument();
    expect(screen.getByText('The Customer is Always Right EP')).toBeInTheDocument();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    render(
      <HelmetProvider context={helmetContext}>
        <Discography />
      </HelmetProvider>
    );
    expect(helmetContext.helmet.title.toString()).toContain('Discography');
  });
});
