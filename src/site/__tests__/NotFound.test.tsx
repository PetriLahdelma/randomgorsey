import React from "react";
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "../NotFound";

describe("NotFound Page", () => {
  it("renders heading", () => {
    render(
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>
    );
    expect(
      screen.getByRole("heading", { name: /Lost in the mix/i })
    ).toBeInTheDocument();
  });

  it("renders back to home link", () => {
    render(
      <HelmetProvider>
        <NotFound />
      </HelmetProvider>
    );
    expect(
      screen.getByText(/Back to home/i)
    ).toBeInTheDocument();
  });
});
