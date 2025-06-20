import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Contact from '../Contact';

describe('Contact Page', () => {
  it('renders heading', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    jest.useFakeTimers();
    render(
      <HelmetProvider context={helmetContext}>
        <Contact />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(helmetContext.helmet.title.toString()).toContain('Contact');
    jest.useRealTimers();
  });
});
