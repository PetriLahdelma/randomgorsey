import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Alert from "../Alert";

describe("Alert Component", () => {
  it("renders children", () => {
    render(<Alert>Info</Alert>);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("keeps the status semantic across variants", () => {
    render(<Alert variant="success">OK</Alert>);
    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveTextContent("OK");
  });

  it("dismisses from a named button", () => {
    render(<Alert isCloseable>Dismiss me</Alert>);
    fireEvent.click(screen.getByRole("button", { name: "Close alert" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
