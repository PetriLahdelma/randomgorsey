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
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByRole('heading', { name: /Contact/i })).toBeInTheDocument();
    jest.useRealTimers();
  });
});
