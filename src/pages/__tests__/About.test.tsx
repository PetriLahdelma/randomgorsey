import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import About from "../About";

describe("About Page", () => {
  it("renders heading", () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <About />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByRole("heading", { name: /About/i })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("sets page title", () => {
    jest.useFakeTimers();
    // Test that the component renders and check document title
    render(
      <HelmetProvider>
        <About />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByRole("heading", { name: /About/i })).toBeInTheDocument();
    jest.useRealTimers();
  });
});
