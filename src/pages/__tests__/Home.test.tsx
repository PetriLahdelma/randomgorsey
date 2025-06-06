import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Home from '../Home';

jest.useFakeTimers();

describe('Home Page', () => {
  it('shows welcome text after loading', () => {
    render(<Home />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText(/Welcome to Random Gorsey Website/i)).toBeInTheDocument();
  });
});
