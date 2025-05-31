import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the header and footer', () => {
  render(<App />);
  const headerElement = screen.getByRole('banner');
  const footerElement = screen.getByRole('contentinfo');
  expect(headerElement).toBeInTheDocument();
  expect(footerElement).toBeInTheDocument();
});

test('renders the home page content', () => {
  render(<App />);
  const homeContent = screen.getByText(/welcome to home/i);
  expect(homeContent).toBeInTheDocument();
});

test('renders the not found page for invalid routes', () => {
  render(<App />);
  const notFoundContent = screen.getByText(/page not found/i);
  expect(notFoundContent).toBeInTheDocument();
});
