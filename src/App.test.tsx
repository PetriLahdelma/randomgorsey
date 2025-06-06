import React from 'react';
import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import App from './App';

jest.mock('react-router-dom', () => {
  const HashRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const BrowserRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Link = ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>;
  const Route = ({ path, element }: { path: string; element: React.ReactNode }) => <div>{element}</div>;
  const Router = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Routes = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const useNavigate = () => () => {};
  const useParams = () => ({});
  const useLocation = () => ({ pathname: '/' });

  return {
    HashRouter,
    BrowserRouter,
    Link,
    Route,
    Router,
    Routes,
    useNavigate,
    useParams,
    useLocation,
  };
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('renders the header and footer', () => {
  render(<App />);
  const headerElement = screen.getByRole('banner');
  const footerElement = screen.getByRole('contentinfo');
  expect(headerElement).toBeInTheDocument();
  expect(footerElement).toBeInTheDocument();
});

test('renders the home page content', async () => {
  render(<App />);

  // Check that at least one Spinner is initially visible
  const spinners = screen.getAllByTestId('spinner');
  expect(spinners.length).toBeGreaterThan(0);

  // Fast-forward time to simulate loading completion
  jest.advanceTimersByTime(1000);

  // Wait for the home page content to render
  const homeContent = await screen.findByText(/welcome to random gorsey website/i);
  expect(homeContent).toBeInTheDocument();
});

test('renders the not found page for invalid routes', async () => {
  const history = createMemoryHistory();
  history.push('/invalid-route');

  render(
    <Router location={history.location} navigator={history}>
      <App />
    </Router>
  );

  // Check that at least one Spinner is initially visible
  const spinners = screen.getAllByTestId('spinner');
  expect(spinners.length).toBeGreaterThan(0);

  // Fast-forward time to simulate loading completion
  jest.advanceTimersByTime(1000);

  // Log the DOM structure for debugging
  console.log(document.body.innerHTML);

  // Wait for the not found page content to render
  const notFoundContent = await screen.findByText(/404 - page not found/i);
  expect(notFoundContent).toBeInTheDocument();
});
