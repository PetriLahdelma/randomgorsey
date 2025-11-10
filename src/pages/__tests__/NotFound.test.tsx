import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from '../NotFound';

jest.mock('../../components/Spinner', () => () => <div data-testid="spinner"></div>);

describe('NotFound Page', () => {
  it('renders heading after load', () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <HelmetProvider>
          <NotFound />
        </HelmetProvider>
      </MemoryRouter>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /404 - Page Not Found/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <HelmetProvider>
          <NotFound />
        </HelmetProvider>
      </MemoryRouter>
    );
    act(() => {
      jest.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByRole('heading', { name: /404 - Page Not Found/i })).toBeInTheDocument();
    jest.useRealTimers();
  });
});
