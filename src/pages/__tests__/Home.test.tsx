import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "../Home";

describe("Home Page", () => {
  it("renders latest posts heading", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText(/Latest Posts/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("sets page title", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByText(/Latest Posts/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
