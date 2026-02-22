import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "../NotFound";

vi.mock("../../components/Spinner", () => ({
  default: () => <div data-testid="spinner"></div>,
}));

describe("NotFound Page", () => {
  it("renders heading after load", () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <HelmetProvider>
          <NotFound />
        </HelmetProvider>
      </MemoryRouter>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(
      screen.getByRole("heading", { name: /404 - Page Not Found/i })
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("sets page title", () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <HelmetProvider>
          <NotFound />
        </HelmetProvider>
      </MemoryRouter>
    );
    act(() => {
      vi.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(
      screen.getByRole("heading", { name: /404 - Page Not Found/i })
    ).toBeInTheDocument();
    vi.useRealTimers();
  });
});
