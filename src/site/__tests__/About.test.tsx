import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import About from "../About";

const performanceState = vi.hoisted(() => ({
  effectsEnabled: true,
  isReducedMotion: false,
}));

vi.mock("@/lib/performance", () => ({
  usePerformance: () => ({
    tier: 1,
    isMobile: false,
    canWebGL: false,
    setEffectsEnabled: vi.fn(),
    ...performanceState,
  }),
}));

describe("About Page", () => {
  beforeEach(() => {
    performanceState.effectsEnabled = true;
    performanceState.isReducedMotion = false;
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("preserves the artist biography and side-project destinations", () => {
    render(<About />);

    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
    expect(screen.getByText(/Helsinki-based producer Random Gorsey aka DJ Pizza Hut/)).toBeInTheDocument();
    expect(screen.getByText(/Self-taught and driven by instinct/)).toBeInTheDocument();
    expect(screen.getByText(/Actively producing and exploring new tools/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Petri Lahdelma/ })).toHaveAttribute(
      "href",
      "https://soundcloud.com/petri-lahdelma"
    );
    expect(screen.getByRole("link", { name: /Dj Pizza Hut/ })).toHaveAttribute(
      "href",
      "https://soundcloud.com/dj-pizza-hut"
    );
  });

  it("autoplays the muted loop when motion policy allows and pauses the existing media", async () => {
    const user = userEvent.setup();
    const { container } = render(<About />);

    await waitFor(() => expect(container.querySelector("video")).toBeInTheDocument());
    const video = container.querySelector('video[title="Portrait of Random Gorsey"]');
    expect(video).toHaveProperty("muted", true);
    expect(video).toHaveProperty("autoplay", true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();

    fireEvent.play(video as HTMLVideoElement);
    await user.click(screen.getByRole("button", { name: "Pause portrait loop" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(container.querySelector("video")).toBe(video);
    fireEvent.pause(video as HTMLVideoElement);
    expect(screen.getByRole("button", { name: "Play portrait loop" })).toBeInTheDocument();
  });

  it("uses the still under reduced motion until playback is explicitly requested", async () => {
    performanceState.isReducedMotion = true;
    const user = userEvent.setup();
    const { container } = render(<About />);

    expect(screen.getByRole("img", { name: "Portrait of Random Gorsey" })).toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Play portrait loop" }));

    await waitFor(() => expect(container.querySelector('video[title="Portrait of Random Gorsey"]')).toBeInTheDocument());
    expect(container.querySelector('source[src="/videos/shadow-portrait-loop.webm"]')).toBeInTheDocument();
  });
});
