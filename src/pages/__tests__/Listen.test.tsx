import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Listen from '../Listen';

describe('Listen Page', () => {
  it('renders heading', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <Listen />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /Listen to Music/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    jest.useFakeTimers();
    render(
      <HelmetProvider context={helmetContext}>
        <Listen />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(helmetContext.helmet.title.toString()).toContain('Listen');
    jest.useRealTimers();
  });
});
