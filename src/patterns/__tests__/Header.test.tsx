import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header", () => {
  it("renders navigation with correct aria label", () => {
    render(<Header />);
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Main navigation"
    );
  });

  it("renders the logo linking to home", () => {
    render(<Header />);
    const logo = screen.getByLabelText("Random Gorsey — Home");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders desktop nav links without Home", () => {
    render(<Header />);
    expect(screen.getByTitle("Listen to music")).toBeInTheDocument();
    expect(screen.getByTitle("About Random Gorsey")).toBeInTheDocument();
    expect(screen.getByTitle("Get in touch")).toBeInTheDocument();
    expect(screen.getByTitle("View releases")).toBeInTheDocument();
    expect(screen.getByTitle("Photo gallery")).toBeInTheDocument();
    // Home is not in desktop nav links — only via logo
    expect(screen.queryByTitle("Go to Home page")).not.toBeInTheDocument();
  });

  it("renders Discography instead of Disco", () => {
    render(<Header />);
    expect(screen.getByText("Discography")).toBeInTheDocument();
    expect(screen.queryByText("Disco")).not.toBeInTheDocument();
  });

  it("opens and closes the mobile navigation with keyboard focus restored", () => {
    render(<Header />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(screen.getByRole("navigation"), { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
