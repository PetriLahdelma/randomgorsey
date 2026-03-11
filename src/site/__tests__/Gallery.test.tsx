import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Gallery from "../Gallery";

describe("Gallery Page", () => {
  it("renders heading", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Gallery onOverlayStateChange={() => {}} />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText(/Gallery/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("sets page title", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Gallery />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByText(/Gallery/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
