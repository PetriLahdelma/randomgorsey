import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the header and footer', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const headerElement = screen.getByRole('banner');
  const footerElement = screen.getByRole('contentinfo');
  expect(headerElement).toBeInTheDocument();
  expect(footerElement).toBeInTheDocument();
});

test('renders the home page content', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  await waitFor(() => {
    const homeContents = screen.getAllByText((content) =>
      content.includes('Welcome to Random Gorsey Website')
    );
    expect(homeContents.length).toBeGreaterThan(0);
  });
});

test('renders the not found page for invalid routes', async () => {
  render(
    <MemoryRouter initialEntries={['/invalid-route']}>
      <App />
    </MemoryRouter>
  );

  // Wait for the spinner to disappear
  await waitFor(() => {
    const spinners = screen.queryAllByTestId('spinner');
    expect(spinners.length).toBe(0);
  });

  // Check for the not found text using the test ID
  const notFoundContent = await screen.findByTestId('not-found-title');
  expect(notFoundContent).toBeInTheDocument();
});
