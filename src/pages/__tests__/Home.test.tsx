import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

jest.useFakeTimers();

describe('Home Page', () => {
  it('shows welcome text after loading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText(/Welcome to Random Gorsey Website/i)).toBeInTheDocument();
  });

  test('renders additional content', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const additionalContent = screen.getByText('Explore our features and enjoy your stay!');
    expect(additionalContent).toBeInTheDocument();
  });
});
