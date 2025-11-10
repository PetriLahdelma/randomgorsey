import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "../Badge";

describe("Badge Component", () => {
  it("renders text", () => {
    render(<Badge text="New" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Badge text="Hot" variant="danger" />);
    const badgeElement = screen.getByText("Hot");
    expect(badgeElement).toHaveClass("danger");
  });
});
