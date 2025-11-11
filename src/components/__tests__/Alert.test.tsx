import React from "react";
import { render, screen } from "@testing-library/react";
import Alert from "../Alert";

describe("Alert Component", () => {
  it("renders children", () => {
    render(<Alert>Info</Alert>);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Alert variant="success">OK</Alert>);
    const alertElement = screen.getByText("OK");
    expect(alertElement).toHaveClass("success");
  });
});
