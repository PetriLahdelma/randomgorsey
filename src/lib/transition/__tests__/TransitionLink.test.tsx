import type { ReactElement } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TransitionLink } from "../TransitionLink";
import { TransitionContext } from "../TransitionContext";

function renderWithContext(
  ui: ReactElement,
  navigate = vi.fn(),
  isTransitioning = false
) {
  return render(
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {ui}
    </TransitionContext.Provider>
  );
}

describe("TransitionLink", () => {
  it("renders as an anchor with href", () => {
    renderWithContext(<TransitionLink href="/gallery">Gallery</TransitionLink>);
    const link = screen.getByRole("link", { name: "Gallery" });
    expect(link).toHaveAttribute("href", "/gallery");
  });

  it("calls navigate on click and prevents default", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate
    );
    const link = screen.getByRole("link", { name: "About" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "metaKey", { value: false });
    Object.defineProperty(event, "ctrlKey", { value: false });
    fireEvent(link, event);
    expect(navigate).toHaveBeenCalledWith("/about");
  });

  it("does NOT intercept meta+click (new tab)", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate
    );
    const link = screen.getByRole("link", { name: "About" });
    fireEvent.click(link, { metaKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does NOT intercept ctrl+click (new tab)", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate
    );
    const link = screen.getByRole("link", { name: "About" });
    fireEvent.click(link, { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does NOT navigate when already transitioning", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate,
      true
    );
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("passes className and title to anchor", () => {
    renderWithContext(
      <TransitionLink href="/about" className="nav-link" title="About page">
        About
      </TransitionLink>
    );
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveAttribute("title", "About page");
  });

  it("falls through for external URLs", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="https://example.com">External</TransitionLink>,
      navigate
    );
    fireEvent.click(screen.getByRole("link", { name: "External" }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("falls through for anchor links (same page)", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="#section">Jump</TransitionLink>,
      navigate
    );
    fireEvent.click(screen.getByRole("link", { name: "Jump" }));
    expect(navigate).not.toHaveBeenCalled();
  });
});
