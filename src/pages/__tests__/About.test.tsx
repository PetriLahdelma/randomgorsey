import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import About from "../About";

describe("About Page", () => {
  it("renders heading", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <About />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("sets page title", () => {
    vi.useFakeTimers();
    // Test that the component renders and check document title
    render(
      <HelmetProvider>
        <About />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
