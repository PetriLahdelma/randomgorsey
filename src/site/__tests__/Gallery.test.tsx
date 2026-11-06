import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import galleryImages, { galleryDisplayName } from "@/data/galleryImages";
import Gallery from "../Gallery";

describe("Gallery Page", () => {
  it("renders every preserved gallery image and caption", () => {
    render(<Gallery />);

    expect(screen.getByRole("heading", { level: 1, name: "Gallery" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Open image:/ })).toHaveLength(galleryImages.length);
    for (const image of galleryImages) {
      expect(screen.getByText(galleryDisplayName(image))).toBeInTheDocument();
    }
    const names = galleryImages.map(galleryDisplayName);
    expect(new Set(names).size).toBe(galleryImages.length);
    expect(names.every((name) => /^[A-Z0-9]+(?:_[A-Z0-9]+)*\.JPG$/.test(name))).toBe(true);
    expect(names.every((name) => !name.includes("HELSINKI"))).toBe(true);
    expect(names).toContain("UNTITLED_09.JPG");
    expect(names).toContain("RANDOM_GORSEY_GRIT_POSTER.JPG");
    expect(galleryImages).toContainEqual({
      src: "/images/untitled_09.png",
      caption: "UNTITLED_09.JPG",
      alt: "Shadowed portrait wearing a beanie and glasses",
      width: 1254,
      height: 1254,
    });
  });

  it("opens a keyboard-operable viewer and returns focus to its thumbnail", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const firstTrigger = screen.getByRole("button", { name: `Open image: ${galleryDisplayName(galleryImages[0])}` });

    await user.click(firstTrigger);
    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(within(dialog).getByText(galleryDisplayName(galleryImages[0]))).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("button", { name: "Close image" })).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(within(dialog).getByRole("button", { name: "Next image" })).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole("button", { name: "Close image" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByText(galleryDisplayName(galleryImages[1]))).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Image viewer" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(firstTrigger).toHaveFocus();
  });
});
