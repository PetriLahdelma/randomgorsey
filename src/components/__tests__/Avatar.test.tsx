import React from "react";
import { render, screen } from "@testing-library/react";
import Avatar from "../Avatar";

describe("Avatar Component", () => {
  it("renders initials when no image is provided", () => {
    render(<Avatar avatarColor="#f00" initials="AB" />);
    const avatar = screen.getByText("AB");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveStyle("background-color: #f00");
  });

  it("renders an image when avatarImage is provided", () => {
    render(<Avatar avatarImage="/path/to/image.jpg" />);
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", "/path/to/image.jpg");
  });
});
