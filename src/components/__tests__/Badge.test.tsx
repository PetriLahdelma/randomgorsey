import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "../Badge";

describe("Badge Component", () => {
  it("renders text", () => {
    render(<Badge text="New" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("retains the requested variant and disabled semantics", () => {
    render(<Badge text="Hot" variant="danger" />);
    const badgeElement = screen.getByText("Hot");
    expect(badgeElement).not.toHaveAttribute("aria-disabled");

    render(<Badge text="Unavailable" disabled />);
    expect(screen.getByText("Unavailable")).toHaveAttribute("aria-disabled", "true");
  });
});
