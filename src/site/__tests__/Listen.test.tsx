import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PlayerProvider } from "@/components/player/PersistentPlayer";
import Listen from "../Listen";

const routeState = vi.hoisted(() => ({ pathname: "/listen/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => routeState.pathname,
}));

const renderListen = () => render(<PlayerProvider><Listen /></PlayerProvider>);

describe("Listen Page", () => {
  beforeAll(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);
  });

  beforeEach(() => {
    routeState.pathname = "/listen/";
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("starts without loading third-party players", () => {
    const { container } = renderListen();

    expect(screen.getByRole("heading", { name: "Listen" })).toBeInTheDocument();
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load spotify player/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load soundcloud player/i })).toBeInTheDocument();
  });

  it("loads only one requested provider at a time", () => {
    const { container } = renderListen();

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
    renderListen();

    expect(screen.queryByRole("navigation", { name: "Music platforms" })).not.toBeInTheDocument();
    expect(screen.getByText(/direct links are available in the footer/i)).toBeInTheDocument();
  });

  it("offers a direct fallback when a requested player times out", () => {
    vi.useFakeTimers();
    renderListen();

    fireEvent.click(screen.getByRole("button", { name: /load soundcloud player/i }));
    act(() => vi.advanceTimersByTime(12_000));

    expect(screen.getByRole("alert")).toHaveTextContent(/taking longer than expected/i);
    expect(screen.getByRole("link", { name: /open soundcloud directly/i })).toHaveAttribute(
      "href",
      "https://soundcloud.com/randomgorsey/sets/tuunz"
    );
    vi.useRealTimers();
  });

  it("keeps the same iframe mounted when minimized and expanded", () => {
    renderListen();
    fireEvent.click(screen.getByRole("button", { name: /load spotify player/i }));
    const iframe = screen.getByTitle("Spotify player");

    fireEvent.click(screen.getByRole("button", { name: "Minimize player" }));
    expect(screen.getByTitle("Spotify player")).toBe(iframe);
    const expand = screen.getByRole("button", { name: "Expand player" });
    expect(expand).toBeInTheDocument();
    expect(iframe).toHaveAttribute("tabindex", "-1");
    expect(iframe.closest('[aria-hidden="true"]')).toHaveAttribute("inert");

    fireEvent.click(expand);
    expect(screen.getByTitle("Spotify player")).toBe(iframe);
    expect(iframe).toHaveAttribute("tabindex", "0");
  });

  it("expands an already-active provider without resetting or replacing it", () => {
    renderListen();
    const source = screen.getByRole("button", { name: /load spotify player/i });
    fireEvent.click(source);
    const iframe = screen.getByTitle("Spotify player");
    fireEvent.load(iframe);
    fireEvent.click(screen.getByRole("button", { name: "Minimize player" }));

    fireEvent.click(source);

    expect(screen.getByTitle("Spotify player")).toBe(iframe);
    expect(screen.queryByText(/connecting to spotify/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Minimize player" })).toBeInTheDocument();
  });

  it("moves focus to the replacement presentation control", async () => {
    renderListen();
    fireEvent.click(screen.getByRole("button", { name: /load spotify player/i }));

    fireEvent.click(screen.getByRole("button", { name: "Minimize player" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Expand player" })).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "Expand player" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Minimize player" })).toHaveFocus());
  });

  it("unloads the provider only when the player is closed", async () => {
    renderListen();
    const source = screen.getByRole("button", { name: /load spotify player/i });
    fireEvent.click(source);
    expect(screen.getByTitle("Spotify player")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close player" }));
    expect(screen.queryByTitle("Spotify player")).not.toBeInTheDocument();
    expect(screen.getByText(/no third-party player loaded/i)).toBeInTheDocument();
    await waitFor(() => expect(source).toHaveFocus());
  });

  it("automatically compacts the same iframe after route navigation", async () => {
    const { rerender } = renderListen();
    fireEvent.click(screen.getByRole("button", { name: /load soundcloud player/i }));
    const iframe = screen.getByTitle("SoundCloud player");

    routeState.pathname = "/about/";
    rerender(<PlayerProvider><div>About route</div></PlayerProvider>);

    await waitFor(() => expect(screen.getByRole("button", { name: "Expand player" })).toBeInTheDocument());
    expect(screen.getByTitle("SoundCloud player")).toBe(iframe);
    expect(screen.getByText(/soundcloud player minimized/i)).toBeInTheDocument();
    expect(screen.queryByText(/playback continues/i)).not.toBeInTheDocument();

    routeState.pathname = "/listen/";
    rerender(<PlayerProvider><Listen /></PlayerProvider>);
    await waitFor(() => expect(screen.getByRole("button", { name: "Minimize player" })).toBeInTheDocument());
    expect(screen.getByTitle("SoundCloud player")).toBe(iframe);
  });

  it("preserves a deliberate minimized state when leaving and returning", async () => {
    const { rerender } = renderListen();
    fireEvent.click(screen.getByRole("button", { name: /load spotify player/i }));
    const iframe = screen.getByTitle("Spotify player");
    fireEvent.click(screen.getByRole("button", { name: "Minimize player" }));

    routeState.pathname = "/about/";
    rerender(<PlayerProvider><div>About route</div></PlayerProvider>);
    routeState.pathname = "/listen/";
    rerender(<PlayerProvider><Listen /></PlayerProvider>);

    await waitFor(() => expect(screen.getByRole("button", { name: "Expand player" })).toBeInTheDocument());
    expect(screen.getByTitle("Spotify player")).toBe(iframe);
  });
});
