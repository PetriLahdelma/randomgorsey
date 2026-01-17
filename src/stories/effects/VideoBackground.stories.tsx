import type { Meta, StoryObj } from "@storybook/react";
import { VideoBackground } from "@/components/effects";

// Placeholder assets for Storybook demos
const PLACEHOLDER_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";
const PLACEHOLDER_POSTER = "https://picsum.photos/1920/1080";

const meta: Meta<typeof VideoBackground> = {
  title: "Effects/VideoBackground",
  component: VideoBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-bleed video background with performance-tiered fallbacks. Shows poster on tier 0, mobile, or reduced motion. Uses h-dvh for proper mobile viewport handling.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "Video source URL (WebM preferred)",
    },
    poster: {
      control: "text",
      description: "Poster image shown on low-tier devices or while loading",
    },
    fallbackSrc: {
      control: "text",
      description: "Optional MP4 fallback for broader compatibility",
    },
    overlayOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Overlay opacity for text readability (0-1)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof VideoBackground>;

/**
 * Default video background without overlay.
 * On desktop with a capable GPU (tier 1+), video plays automatically.
 * On mobile or low-tier devices, only the poster image is shown.
 */
export const Default: Story = {
  args: {
    src: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
  },
};

/**
 * Video background with a dark overlay for better text contrast.
 * Common pattern for hero sections with overlaid content.
 */
export const WithOverlay: Story = {
  args: {
    src: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
    overlayOpacity: 0.5,
  },
};

/**
 * Demonstrates the poster fallback behavior.
 *
 * Note: The actual fallback is determined by the PerformanceProvider.
 * On tier 0 devices, mobile, or with reduced motion preferences,
 * only the poster image is displayed to conserve battery and
 * respect accessibility preferences.
 */
export const PosterFallback: Story = {
  name: "Poster Fallback (tier 0/mobile/reduced motion)",
  parameters: {
    docs: {
      description: {
        story:
          "On tier 0 devices, mobile, or with prefers-reduced-motion enabled, only the poster image is shown. This is automatic based on PerformanceProvider detection.",
      },
    },
  },
  args: {
    src: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
  },
};

/**
 * Hero section example with content overlaid on the video.
 * Shows how VideoBackground integrates with page content.
 */
export const WithHeroContent: Story = {
  render: (args) => (
    <>
      <VideoBackground {...args} />
      <div className="relative z-10 flex h-screen items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">Hero Title</h1>
          <p className="mt-4 text-xl drop-shadow-md">
            Content overlaid on video background
          </p>
        </div>
      </div>
    </>
  ),
  args: {
    src: PLACEHOLDER_VIDEO,
    poster: PLACEHOLDER_POSTER,
    overlayOpacity: 0.4,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example showing VideoBackground as a backdrop with hero content overlaid.",
      },
    },
  },
};
