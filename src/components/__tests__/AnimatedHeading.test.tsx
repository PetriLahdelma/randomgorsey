import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedHeading } from "../AnimatedHeading";

// Override the global setupTests mock (tier: 1) so animated branch renders
vi.mock("@/lib/performance", () => ({
  usePerformance: () => ({ tier: 3, isReducedMotion: false }),
}));

describe("AnimatedHeading", () => {
  it("renders the text content", () => {
    render(<AnimatedHeading level={2}>Latest Posts</AnimatedHeading>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Latest Posts"
    );
  });

  it("renders with the correct heading level", () => {
    render(<AnimatedHeading level={3}>Section</AnimatedHeading>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("splits text into individual character spans", () => {
    const { container } = render(
      <AnimatedHeading level={2}>Hello</AnimatedHeading>
    );
    const charSpans = container.querySelectorAll("[data-char]");
    expect(charSpans).toHaveLength(5);
  });

  it("renders ghost echo element", () => {
    const { container } = render(
      <AnimatedHeading level={2}>Test</AnimatedHeading>
    );
    const ghost = container.querySelector("[data-ghost]");
    expect(ghost).toBeInTheDocument();
  });

  it("renders underline element", () => {
    const { container } = render(
      <AnimatedHeading level={2}>Test</AnimatedHeading>
    );
    const underline = container.querySelector("[data-underline]");
    expect(underline).toBeInTheDocument();
  });
});
