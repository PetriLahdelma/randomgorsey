import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Gallery from '../Gallery';

describe('Gallery Page', () => {
  it('renders heading', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <Gallery onOverlayStateChange={() => {}} />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /Gallery/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    jest.useFakeTimers();
    render(
      <HelmetProvider context={helmetContext}>
        <Gallery onOverlayStateChange={() => {}} />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(helmetContext.helmet.title.toString()).toContain('Gallery');
    jest.useRealTimers();
  });
});
