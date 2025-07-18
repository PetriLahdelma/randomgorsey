import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../Home';

describe('Home Page', () => {
  it('renders latest posts heading', () => {
    jest.useFakeTimers();
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole('heading', { name: /Latest Posts/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('sets page title', () => {
    const helmetContext: any = {};
    jest.useFakeTimers();
    render(
      <HelmetProvider context={helmetContext}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(helmetContext.helmet.title.toString()).toContain('Random Gorsey');
    jest.useRealTimers();
  });
});
