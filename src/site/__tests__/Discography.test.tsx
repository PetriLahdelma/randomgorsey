import React from "react";
import { render, screen } from "@testing-library/react";
import Discography from "../Discography";
import { releases } from "@/content/releases";

describe("Discography Page", () => {
  it("lists releases", () => {
    render(<Discography />);
    expect(screen.getByText(/Discography/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "So Long Spectrum" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The Customer is Always Right EP" })
    ).toBeInTheDocument();
  });

  it("preserves the two release records and stable anchors", () => {
    const { container } = render(<Discography />);

    expect(releases).toEqual([
      expect.objectContaining({
        id: "so-long-spectrum",
        title: "So Long Spectrum",
        catalog: "FIRGO2100004",
        year: 2021,
        tracks: ["So long spectrum"],
      }),
      expect.objectContaining({
        id: "customer-is-always-right",
        title: "The Customer is Always Right EP",
        catalog: "RDGY 01",
        year: 2021,
        tracks: ["Chillax Karen", "The Customer is Always Right", "Fuck Face Masks"],
      }),
    ]);
    expect(container.querySelector("#so-long-spectrum")).toBeInTheDocument();
    expect(container.querySelector("#customer-is-always-right")).toBeInTheDocument();
  });

  it("uses neutral platform labels for exact release destinations", () => {
    render(<Discography />);

    expect(screen.getByRole("link", { name: /so long spectrum on bandcamp/i })).toHaveAttribute(
      "href",
      "https://randomgorsey.bandcamp.com/track/so-long-spectrum"
    );
    expect(screen.getByRole("link", { name: /customer is always right ep on bandcamp/i })).toHaveAttribute(
      "href",
      "https://randomgorsey.bandcamp.com/album/the-customer-is-always-right"
    );
  });
});
