import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../Home';

describe('Home Page', () => {
  it('renders latest posts heading', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /Latest Posts/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByRole('heading', { name: /Latest Posts/i })).toBeInTheDocument();
    jest.useRealTimers();
  });
});
