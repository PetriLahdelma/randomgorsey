import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    const logo = screen.getByText("Random Gorsey");
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "/");
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

  it("uses muted grey styling for inactive nav links", () => {
    render(<Header />);
    const link = screen.getByTitle("Listen to music");
    expect(link.className).toContain("text-neutral-400");
  });
});
