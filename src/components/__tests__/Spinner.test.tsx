import React from "react";
import { render, screen } from "@testing-library/react";
import Spinner from "../Spinner";

describe("Spinner Component", () => {
  it("renders the spinner element", () => {
    render(<Spinner />);
    const spinnerElement = screen.getByRole("status");
    expect(spinnerElement).toHaveClass("spinner");
  });
});
