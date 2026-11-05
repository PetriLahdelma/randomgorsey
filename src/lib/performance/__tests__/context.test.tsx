import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

vi.unmock('../context');

import { PerformanceProvider, usePerformance } from '../context';

let reducedMotion = false;
let coarsePointer = false;
let motionListeners: Array<() => void> = [];

function Consumer() {
  const { effectsEnabled, tier, canWebGL, isMobile } = usePerformance();
  return (
    <output data-testid="profile">
      {effectsEnabled ? 'motion ready' : 'motion paused'}; tier {tier}; webgl{' '}
      {String(canWebGL)}; mobile {String(isMobile)}
    </output>
  );
}

describe('PerformanceProvider automatic motion policy', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: undefined,
    });
    reducedMotion = false;
    coarsePointer = false;
    motionListeners = [];
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      get matches() {
        if (query.includes('prefers-reduced-motion')) return reducedMotion;
        if (query.includes('pointer: coarse')) return coarsePointer;
        return false;
      },
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event, listener) => {
        if (
          query.includes('prefers-reduced-motion') &&
          typeof listener === 'function'
        ) {
          motionListeners.push(listener);
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('starts paused for hydration and becomes ready after preference reconciliation', async () => {
    render(
      <PerformanceProvider>
        <Consumer />
      </PerformanceProvider>
    );

    expect(screen.getByTestId('profile')).toHaveTextContent('motion paused');
    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent('motion ready');
    });
    expect(window.localStorage.getItem('random-gorsey-effects')).toBeNull();
  });

  it('keeps hardware unknown and does not persist an effects preference', async () => {
    window.localStorage.setItem('random-gorsey-effects', 'off');
    render(
      <PerformanceProvider>
        <Consumer />
      </PerformanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent(
        'motion ready; tier 0; webgl false'
      );
    });
    expect(window.localStorage.getItem('random-gorsey-effects')).toBe('off');
  });

  it('never enables motion when reduced motion is active', async () => {
    reducedMotion = true;
    render(
      <PerformanceProvider>
        <Consumer />
      </PerformanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent('motion paused');
    });
  });

  it('turns active motion off when reduced-motion preference changes live', async () => {
    render(
      <PerformanceProvider>
        <Consumer />
      </PerformanceProvider>
    );
    await screen.findByText(/motion ready/);

    reducedMotion = true;
    act(() => {
      motionListeners.forEach((listener) => listener());
    });

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent('motion paused');
    });
  });

  it('keeps motion paused when data saver is on', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: {
        saveData: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });

    render(
      <PerformanceProvider>
        <Consumer />
      </PerformanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent('motion paused');
    });
  });

  it('reports coarse pointer input without probing GPU capability', async () => {
    coarsePointer = true;
    render(
      <PerformanceProvider>
        <Consumer />
      </PerformanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile')).toHaveTextContent('mobile true');
    });
    expect(screen.getByTestId('profile')).toHaveTextContent(
      'tier 0; webgl false'
    );
  });
});
