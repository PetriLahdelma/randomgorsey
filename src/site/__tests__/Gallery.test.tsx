import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import galleryImages from "@/data/galleryImages";
import Gallery from "../Gallery";

describe("Gallery Page", () => {
  it("renders every preserved gallery image and caption", () => {
    render(<Gallery />);

    expect(screen.getByRole("heading", { level: 1, name: "Gallery" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Open image:/ })).toHaveLength(galleryImages.length);
    for (const image of galleryImages) {
      expect(screen.getByText(image.caption)).toBeInTheDocument();
    }
    expect(galleryImages).toContainEqual({
      src: "/images/varjostettu-muotokuva-pipossa-ja-laseissa.png",
      caption: "Varjostettu muotokuva pipossa ja laseissa",
      width: 1254,
      height: 1254,
    });
  });

  it("opens a keyboard-operable viewer and returns focus to its thumbnail", async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    const firstTrigger = screen.getByRole("button", { name: `Open image: ${galleryImages[0].caption}` });

    await user.click(firstTrigger);
    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(within(dialog).getByText(galleryImages[0].caption)).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("button", { name: "Close image" })).toHaveFocus();

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(within(dialog).getByRole("button", { name: "Next image" })).toHaveFocus();
    await user.tab();
    expect(within(dialog).getByRole("button", { name: "Close image" })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(within(dialog).getByText(galleryImages[1].caption)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Image viewer" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
    expect(firstTrigger).toHaveFocus();
  });
});
