import React, { act } from 'react';
import { render, screen } from '@testing-library/react';

const performanceState = {
  tier: 3,
  isMobile: false,
  isReducedMotion: false,
  canWebGL: true,
  effectsEnabled: true,
};

vi.mock('@/lib/performance', () => ({
  usePerformance: () => performanceState,
}));

import { VideoBackground } from '../VideoBackground';

let intersectionCallback: IntersectionObserverCallback;

class ControlledIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
}

describe('VideoBackground', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver);
    Object.assign(performanceState, {
      tier: 3,
      isMobile: false,
      isReducedMotion: false,
      effectsEnabled: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders only the poster until the scene is both eligible and visible', () => {
    const { container } = render(
      <VideoBackground src="/videos/test.webm" poster="/images/test.jpg" />
    );

    expect(screen.getByRole('img', { name: 'Background' })).toBeInTheDocument();
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('source[src="/videos/test.webm"]')).toBeNull();

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(container.querySelector('video')).toBeInTheDocument();
    expect(container.querySelector('source[src="/videos/test.webm"]')).toBeInTheDocument();
  });

  it.each([
    ['effects off', { effectsEnabled: false }],
    ['reduced motion', { isReducedMotion: true }],
    ['mobile', { isMobile: true }],
    ['GPU capability is unknown', { tier: 0 }],
  ])('never attaches a video source when %s', (_label, override) => {
    Object.assign(performanceState, override);
    const { container } = render(
      <VideoBackground src="/videos/test.webm" poster="/images/test.jpg" />
    );

    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('source')).toBeNull();
  });
});
