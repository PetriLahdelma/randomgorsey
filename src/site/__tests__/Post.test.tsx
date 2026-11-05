import { render, screen } from "@testing-library/react";

import type { Post as PostRecord } from "@/content/post-types";
import Post from "../Post";

vi.mock("@/components/studio/StudioWindow", () => ({
  StudioWindow: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section aria-label={title}>
      {children}
    </section>
  ),
}));

const post: PostRecord = {
  id: 22,
  title: "A quiet journal entry",
  timestamp: "2025-06-30T22:15",
  contentType: "text",
  body: "<p>The exact archived body.</p>",
  author: "Random Gorsey",
};

describe("Post page", () => {
  it("renders server-provided content and adjacent archive links", () => {
    render(
      <Post
        post={post}
        previous={{ id: 23, title: "Newer entry" }}
        next={{ id: 21, title: "Older entry" }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "A quiet journal entry" })
    ).toBeInTheDocument();
    expect(screen.getByText("The exact archived body.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Newer entry/ })).toHaveAttribute(
      "href",
      "/posts/23/"
    );
    expect(screen.getByRole("link", { name: /Older entry/ })).toHaveAttribute(
      "href",
      "/posts/21/"
    );
    expect(document.querySelector("video")).not.toBeInTheDocument();
  });
});
