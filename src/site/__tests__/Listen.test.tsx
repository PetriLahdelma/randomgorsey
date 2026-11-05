import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Listen from "../Listen";

describe("Listen Page", () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("starts without loading third-party players", () => {
    const { container } = render(<Listen />);

    expect(screen.getByRole("heading", { name: "Listen" })).toBeInTheDocument();
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load spotify player/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load soundcloud player/i })).toBeInTheDocument();
  });

  it("loads only one requested provider at a time", () => {
    const { container } = render(<Listen />);

    fireEvent.click(screen.getByRole("button", { name: /load spotify player/i }));
    expect(screen.getByTitle("Spotify player")).toHaveAttribute(
      "src",
      expect.stringContaining("open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q")
    );
    expect(container.querySelectorAll("iframe")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /load soundcloud player/i }));
    expect(screen.getByTitle("SoundCloud player")).toHaveAttribute(
      "src",
      expect.stringContaining("playlists/2029288998")
    );
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.queryByTitle("Spotify player")).not.toBeInTheDocument();
  });

  it("points to the footer instead of repeating the platform links", () => {
    render(<Listen />);

    expect(screen.queryByRole("navigation", { name: "Music platforms" })).not.toBeInTheDocument();
    expect(screen.getByText(/direct links are available in the footer/i)).toBeInTheDocument();
  });

  it("offers a direct fallback when a requested player times out", () => {
    vi.useFakeTimers();
    render(<Listen />);

    fireEvent.click(screen.getByRole("button", { name: /load soundcloud player/i }));
    act(() => vi.advanceTimersByTime(12_000));

    expect(screen.getByRole("alert")).toHaveTextContent(/taking longer than expected/i);
    expect(screen.getByRole("link", { name: /open soundcloud directly/i })).toHaveAttribute(
      "href",
      "https://soundcloud.com/randomgorsey/sets/tuunz"
    );
    vi.useRealTimers();
  });
});
