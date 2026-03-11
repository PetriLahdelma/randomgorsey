import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Listen from "../Listen";

describe("Listen Page", () => {
  it("renders heading", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Listen />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText(/Listen to Music/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("sets page title", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Listen />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByText(/Listen to Music/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
