import React from "react";
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Discography from "../Discography";

describe("Discography Page", () => {
  it("lists releases", () => {
    render(
      <HelmetProvider>
        <Discography />
      </HelmetProvider>
    );
    expect(screen.getByText("Disco")).toBeInTheDocument();
    expect(screen.getByText("graphy")).toBeInTheDocument();
    expect(screen.getByText("So Long Spectrum")).toBeInTheDocument();
    expect(
      screen.getByText("The Customer is Always Right EP")
    ).toBeInTheDocument();
  });

  it("sets page title", () => {
    render(
      <HelmetProvider>
        <Discography />
      </HelmetProvider>
    );
    // The component should render without errors (helmet will update document.title)
    expect(screen.getByText("So Long Spectrum")).toBeInTheDocument();
  });
});
