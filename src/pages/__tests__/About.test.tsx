import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import About from '../About';

describe('About Page', () => {
  it('renders heading', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <About />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    jest.useFakeTimers();
    render(
      <HelmetProvider context={helmetContext}>
        <About />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(helmetContext.helmet.title.toString()).toContain('About');
    jest.useRealTimers();
  });
});
