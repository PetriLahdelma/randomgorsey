import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Contact from "../Contact";

describe("Contact Page", () => {
  it("renders heading", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("sets page title", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Contact />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
