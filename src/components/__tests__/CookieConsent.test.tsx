import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from '../CookieConsent';

const setCookieMock = () => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
  });
};

describe('CookieConsent Component', () => {
  beforeEach(() => {
    setCookieMock();
  });

  it('shows modal when no consent cookie is present', () => {
    render(<CookieConsent />);
    expect(screen.getByText(/cookie notice/i)).toBeInTheDocument();
  });

  it('sets cookie and closes on accept all', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText(/accept all/i));
    expect(document.cookie).toContain('cookieConsent=all');
  });
});
