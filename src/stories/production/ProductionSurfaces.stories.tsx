import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PerformanceProvider } from "@/lib/performance";
import { PlayerProvider } from "@/components/player/PersistentPlayer";
import posts from "@/content/posts";
import About from "@/site/About";
import Contact from "@/site/Contact";
import Discography from "@/site/Discography";
import Gallery from "@/site/Gallery";
import Home from "@/site/Home";
import Listen from "@/site/Listen";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PerformanceProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </PerformanceProvider>
  );
}

function SurfaceFrame({ children }: { children?: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

function StorybookHome() {
  React.useEffect(() => {
    const originalFetch = window.fetch;
    const mockFetch: typeof window.fetch = async (input, init) => {
      const request = input instanceof Request ? input : null;
      const url = new URL(request?.url ?? String(input), window.location.origin);
      const method = (init?.method ?? request?.method ?? "GET").toUpperCase();

      if (
        method === "GET" &&
        url.origin === window.location.origin &&
        url.pathname === "/api/posts"
      ) {
        const offsetParam = url.searchParams.get("offset");
        const limitParam = url.searchParams.get("limit");
        const offset = Number(offsetParam ?? 0);
        const requestedLimit = Number(limitParam ?? 6);
        const limit = Math.min(requestedLimit, 12);

        if (
          (offsetParam !== null && !/^\d+$/.test(offsetParam)) ||
          (limitParam !== null && !/^\d+$/.test(limitParam)) ||
          !Number.isSafeInteger(offset) ||
          offset < 0 ||
          !Number.isSafeInteger(requestedLimit) ||
          requestedLimit < 1
        ) {
          return Response.json(
            { error: "offset must be zero or greater and limit must be positive" },
            { status: 400 }
          );
        }

        return Response.json({
          posts: posts.slice(offset, offset + limit),
          totalPosts: posts.length,
        });
      }

      return originalFetch.call(window, input, init);
    };

    window.fetch = mockFetch;
    return () => {
      if (window.fetch === mockFetch) window.fetch = originalFetch;
    };
  }, []);

  return (
    <SurfaceFrame>
      <Home
        posts={posts.slice(0, 6)}
        archive={posts.map(({ id, title, timestamp, category }) => ({ id, title, timestamp, category }))}
        totalPosts={posts.length}
      />
    </SurfaceFrame>
  );
}

function StorybookContact() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [notice, setNotice] = React.useState(
    "Storybook safety: message delivery is disabled in this preview."
  );

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interceptSubmit = (event: Event) => {
      if (!(event.target instanceof HTMLFormElement)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setNotice("Submission intercepted. No message was sent from Storybook.");
    };

    container.addEventListener("submit", interceptSubmit, { capture: true });
    return () => container.removeEventListener("submit", interceptSubmit, { capture: true });
  }, []);

  return (
    <div ref={containerRef}>
      <p
        role="status"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          padding: "0.75rem 1rem",
          margin: 0,
          color: "var(--studio-ink)",
          background: "var(--studio-acid)",
          fontFamily: "var(--studio-system)",
        }}
      >
        {notice}
      </p>
      <SurfaceFrame><Contact /></SurfaceFrame>
    </div>
  );
}

const meta = {
  title: "Production/Surfaces",
  component: SurfaceFrame,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SurfaceFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeAndJournal: Story = {
  render: () => <StorybookHome />,
  parameters: { nextjs: { navigation: { pathname: "/" } } },
};

export const HomeLoadsMore: Story = {
  render: () => <StorybookHome />,
  parameters: { nextjs: { navigation: { pathname: "/" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findAllByRole("article")).toHaveLength(6);
    await userEvent.click(canvas.getByRole("button", { name: "Load more posts" }));
    await waitFor(() => expect(canvas.getAllByRole("article")).toHaveLength(12));
  },
};

export const ListenConsole: Story = {
  render: () => <SurfaceFrame><Listen /></SurfaceFrame>,
  parameters: { nextjs: { navigation: { pathname: "/listen/" } } },
};

export const DiscographyPage: Story = {
  render: () => <SurfaceFrame><Discography /></SurfaceFrame>,
  parameters: { nextjs: { navigation: { pathname: "/discography/" } } },
};

export const AboutPage: Story = {
  render: () => <SurfaceFrame><About /></SurfaceFrame>,
  parameters: { nextjs: { navigation: { pathname: "/about/" } } },
};

export const GalleryPage: Story = {
  render: () => <SurfaceFrame><Gallery /></SurfaceFrame>,
  parameters: { nextjs: { navigation: { pathname: "/gallery/" } } },
};

export const ContactPage: Story = {
  render: () => <StorybookContact />,
  parameters: { nextjs: { navigation: { pathname: "/contact/" } } },
};

export const ContactSubmissionBlocked: Story = {
  render: () => <StorybookContact />,
  parameters: { nextjs: { navigation: { pathname: "/contact/" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Just saying hello/i }));
    await userEvent.type(canvas.getByLabelText("Name"), "Storybook Visitor");
    await userEvent.type(canvas.getByLabelText("Email"), "storybook@example.com");
    await userEvent.type(canvas.getByLabelText("Message"), "This submission must stay local.");
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Submission intercepted. No message was sent from Storybook."
    );
  },
};
