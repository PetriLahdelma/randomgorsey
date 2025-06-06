import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../NotFound';

// Mock Spinner component
jest.mock('../../components/Spinner', () => () => <div data-testid="spinner"></div>);

describe('NotFound Page', () => {
  test('renders loading spinner initially', () => {
    render(<NotFound />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('renders 404 message after loading', async () => {
    jest.useFakeTimers();
    render(<NotFound />);

    // Fast-forward the timer
    jest.runAllTimers();

    const notFoundTitle = await screen.findByTestId('not-found-title');
    expect(notFoundTitle).toBeInTheDocument();
    expect(notFoundTitle).toHaveTextContent('404 - Page Not Found');

    const notFoundDescription = screen.getByText(
      "Sorry, the page you're looking for does not exist."
    );
    expect(notFoundDescription).toBeInTheDocument();

    jest.useRealTimers();
  });
});
