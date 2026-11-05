import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import CookieConsent from '../CookieConsent';
import CookiePreferencesButton from '../CookiePreferencesButton';

const setCookieMock = () => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
  });
};

describe('CookieConsent Component', () => {
  beforeEach(() => {
    setCookieMock();
    document.getElementById('ga-script')?.remove();
    document.querySelectorAll('script:not([id])').forEach((script) => script.remove());
    delete process.env.NEXT_PUBLIC_GA_TRACKING_ID;
    Reflect.deleteProperty(
      window as unknown as Record<string, unknown>,
      'ga-disable-test-tracking-id'
    );
  });

  it('keeps the server render deterministic and opens after client reconciliation', async () => {
    const serverHtml = renderToString(<CookieConsent />);
    expect(serverHtml).not.toMatch(/cookie notice/i);

    render(<CookieConsent />);
    expect(await screen.findByText(/cookie preferences/i)).toBeInTheDocument();
  });

  it('hydrates a fresh visit without a mismatch', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(<CookieConsent />);
    document.body.appendChild(container);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const root = hydrateRoot(container, <CookieConsent />);
    await waitFor(() => {
      expect(container).toHaveTextContent(/cookie preferences/i);
    });

    expect(
      consoleError.mock.calls.some(([message]) =>
        String(message).toLowerCase().includes('hydration')
      )
    ).toBe(false);

    await act(async () => root.unmount());
    container.remove();
    consoleError.mockRestore();
  });

  it('sets cookie and closes on accept all', async () => {
    render(<CookieConsent />);
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Accept all cookies (including analytics)',
      })
    );
    expect(document.cookie).toContain('cookieConsent=all');
  });

  it('does not lock page scrolling and keeps analytics off until accepted', async () => {
    process.env.NEXT_PUBLIC_GA_TRACKING_ID = 'test-tracking-id';
    render(<CookieConsent />);

    expect(await screen.findByRole('region', { name: /cookie preferences/i }))
      .toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.getElementById('ga-script')).toBeNull();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accept all cookies (including analytics)',
      })
    );

    expect(document.getElementById('ga-script')).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=test-tracking-id'
    );
  });

  it('reopens the current choice and can disable subsequent analytics tracking', async () => {
    process.env.NEXT_PUBLIC_GA_TRACKING_ID = 'test-tracking-id';
    render(
      <>
        <CookieConsent />
        <CookiePreferencesButton />
      </>
    );

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Accept all cookies (including analytics)',
      })
    );
    expect(
      (window as unknown as Record<string, unknown>)[
        'ga-disable-test-tracking-id'
      ]
    ).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Cookie preferences' }));
    expect(await screen.findByText('Current choice: All cookies'))
      .toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Accept only necessary cookies' })
    );

    expect(document.cookie).toContain('cookieConsent=necessary');
    expect(
      (window as unknown as Record<string, unknown>)[
        'ga-disable-test-tracking-id'
      ]
    ).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Cookie preferences' }));
    expect(await screen.findByText('Current choice: Necessary only'))
      .toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Accept all cookies (including analytics)',
      })
    );
    expect(
      (window as unknown as Record<string, unknown>)[
        'ga-disable-test-tracking-id'
      ]
    ).toBe(false);
  });
});
