import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "../NotFound";

describe("NotFound Page", () => {
  it("offers useful routes out of the missing page", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Signal Not Found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Listen" })).toHaveAttribute("href", "/listen/");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact/");
  });
});
