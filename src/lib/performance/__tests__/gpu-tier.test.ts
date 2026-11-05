const getGPUTierMock = vi.hoisted(() => vi.fn());

vi.mock('detect-gpu', () => ({
  getGPUTier: getGPUTierMock,
}));

import { getPerformanceTier } from '../gpu-tier';

describe('getPerformanceTier', () => {
  beforeEach(() => {
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('keeps GPU capability independent from reduced-motion preference', async () => {
    getGPUTierMock.mockResolvedValue({ tier: 3, isMobile: false });

    await expect(getPerformanceTier()).resolves.toEqual({
      tier: 3,
      isMobile: false,
      isReducedMotion: true,
      canWebGL: true,
    });
  });

  it('uses a conservative capability fallback after detection failure', async () => {
    getGPUTierMock.mockRejectedValue(new Error('unavailable'));

    await expect(getPerformanceTier()).resolves.toEqual({
      tier: 0,
      isMobile: false,
      isReducedMotion: true,
      canWebGL: false,
    });
  });
});
