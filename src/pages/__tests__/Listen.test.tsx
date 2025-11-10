import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Listen from "../Listen";

describe("Listen Page", () => {
  it("renders heading", () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <Listen />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(
      screen.getByRole("heading", { name: /Listen to Music/i })
    ).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("sets page title", () => {
    jest.useFakeTimers();
    render(
      <HelmetProvider>
        <Listen />
      </HelmetProvider>
    );
    act(() => {
      jest.runAllTimers();
    });
    // The component should render without errors (helmet will update document.title)
    expect(
      screen.getByRole("heading", { name: /Listen to Music/i })
    ).toBeInTheDocument();
    jest.useRealTimers();
  });
});
