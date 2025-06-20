import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from '../NotFound';

jest.mock('../../components/Spinner', () => () => <div data-testid="spinner"></div>);

describe('NotFound Page', () => {
  it('renders heading after load', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /404 - Page Not Found/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    jest.useFakeTimers();
    render(
      <HelmetProvider context={helmetContext}>
        <NotFound />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(helmetContext.helmet.title.toString()).toContain('404');
    jest.useRealTimers();
  });
});
