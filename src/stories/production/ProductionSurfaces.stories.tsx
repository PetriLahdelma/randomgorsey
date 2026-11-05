import type { Meta, StoryObj } from "@storybook/react";
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

function SurfaceFrame({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

const meta = {
  title: "Production/Surfaces",
  component: SurfaceFrame,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SurfaceFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeAndJournal: Story = {
  render: () => (
    <SurfaceFrame>
      <Home
        posts={posts.slice(0, 6)}
        archive={posts.map(({ id, title, timestamp, category }) => ({ id, title, timestamp, category }))}
        totalPosts={posts.length}
      />
    </SurfaceFrame>
  ),
  parameters: { nextjs: { navigation: { pathname: "/" } } },
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
  render: () => <SurfaceFrame><Contact /></SurfaceFrame>,
  parameters: { nextjs: { navigation: { pathname: "/contact/" } } },
};
