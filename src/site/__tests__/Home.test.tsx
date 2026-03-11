import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Home from "../Home";

describe("Home Page", () => {
  it("renders featured post section", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Home />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByLabelText("Featured post")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders all posts section", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Home />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByLabelText("All posts")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
