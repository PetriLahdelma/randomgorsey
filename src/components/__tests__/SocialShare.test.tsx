import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StudioWindow } from "@/components/studio/StudioWindow";

import SocialShare from "../SocialShare";

const props = {
  url: "https://randomgorsey.com/posts/56/",
  title: "Light Returning",
  text: "Opened the blinds after lunch and the sun was still up.",
};

describe("SocialShare", () => {
  it("uses contextual color tokens inside paper windows", () => {
    render(
      <StudioWindow title="Share" tone="paper">
        <SocialShare {...props} />
      </StudioWindow>
    );

    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(document.querySelector('[data-tone="paper"]')).toContainElement(
      screen.getByRole("button", { name: "Share" })
    );
  });
  it("opens factual share destinations and returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(<SocialShare {...props} />);

    const trigger = screen.getByRole("button", { name: "Share" });
    await user.click(trigger);

    expect(screen.getByRole("menu", { name: "Share Light Returning" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Close share menu" })).toHaveFocus();
    expect(screen.getByRole("menuitem", { name: "Share on X (Twitter)" })).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(props.url))
    );
    expect(screen.getByRole("menuitem", { name: "Share on Reddit" })).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(props.text))
    );

    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("supports arrow-key navigation inside the menu", async () => {
    const user = userEvent.setup();
    render(<SocialShare {...props} />);

    await user.click(screen.getByRole("button", { name: "Share" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Copy link" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("menuitem", { name: "Share on Telegram" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("menuitem", { name: "Close share menu" })).toHaveFocus();
  });

  it("copies the canonical URL and shows feedback without leaving a stale menu", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<SocialShare {...props} />);

    await user.click(screen.getByRole("button", { name: "Share" }));
    await user.click(screen.getByRole("menuitem", { name: "Copy link" }));

    expect(writeText).toHaveBeenCalledWith(props.url);
    expect(screen.getByRole("button", { name: "Share" })).toHaveTextContent("Link copied");
    expect(screen.getByRole("status")).toHaveTextContent("Link copied to clipboard.");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes when the visitor clicks outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SocialShare {...props} />
        <button type="button">Outside</button>
      </div>
    );

    await user.click(screen.getByRole("button", { name: "Share" }));
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes after Tab moves focus beyond the menu", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SocialShare {...props} />
        <button type="button">After share</button>
      </div>
    );

    await user.click(screen.getByRole("button", { name: "Share" }));
    for (let index = 0; index < 7; index += 1) await user.tab();

    expect(screen.getByRole("button", { name: "After share" })).toHaveFocus();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes after Shift+Tab moves focus before the share control", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Before share</button>
        <SocialShare {...props} />
      </div>
    );

    await user.click(screen.getByRole("button", { name: "Share" }));
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Share" })).toHaveFocus();
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.tab({ shift: true });

    expect(screen.getByRole("button", { name: "Before share" })).toHaveFocus();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
