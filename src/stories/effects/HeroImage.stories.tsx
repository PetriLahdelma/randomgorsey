import type { Meta, StoryObj } from "@storybook/react";
import { HeroImage } from "@/components/effects";
import { Container } from "@/components/layout";

const PLACEHOLDER_IMAGE = "https://picsum.photos/1920/1080";

const meta: Meta<typeof HeroImage> = {
  title: "Effects/HeroImage",
  component: HeroImage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-bleed responsive hero image using the Bleed component for edge-to-edge display. Breaks out of Container constraints to span the full viewport width.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description: "Primary image source URL",
    },
    alt: {
      control: "text",
      description: "Alt text for accessibility",
    },
    srcSet: {
      control: "text",
      description: "Optional srcset for responsive images",
    },
    sizes: {
      control: "text",
      description: "Optional sizes attribute for responsive images",
    },
    height: {
      control: "select",
      options: ["half", "full", "auto"],
      description: "Height variant: half (50vh), full (100vh), or auto",
    },
    objectFit: {
      control: "select",
      options: ["cover", "contain"],
      description: "How the image fits within its container",
    },
    objectPosition: {
      control: "text",
      description: "Object position (e.g., center, top, bottom)",
    },
    overlayOpacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Optional overlay for text readability (0-1)",
    },
    loading: {
      control: "select",
      options: ["lazy", "eager"],
      description: "Loading strategy for the image",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroImage>;

/**
 * Default hero image at half viewport height.
 * Most common usage for section headers.
 */
export const Default: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Hero image",
    height: "half",
  },
};

/**
 * Full viewport height hero image.
 * Used for immersive landing pages.
 */
export const FullHeight: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Full height hero",
    height: "full",
  },
};

/**
 * Hero image with a dark overlay for text contrast.
 */
export const WithOverlay: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Hero with overlay",
    height: "half",
    overlayOpacity: 0.4,
  },
};

/**
 * Demonstrates the Bleed behavior: the hero breaks out of the Container
 * to span the full viewport width while content above and below stays contained.
 */
export const InsideContainer: Story = {
  render: (args) => (
    <Container size="lg" className="py-8">
      <p className="mb-4 text-foreground">
        This content is inside a Container with max-width constraints.
      </p>
      <HeroImage {...args} />
      <p className="mt-4 text-foreground">
        The hero image above breaks out of the Container to span full viewport
        width using the Bleed component.
      </p>
    </Container>
  ),
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Hero inside container",
    height: "half",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows how HeroImage uses Bleed to break out of Container constraints while surrounding content stays contained.",
      },
    },
  },
};

/**
 * Hero image with contain fit instead of cover.
 * Shows the entire image without cropping.
 */
export const ContainFit: Story = {
  render: (args) => (
    <div className="bg-muted">
      <HeroImage {...args} />
    </div>
  ),
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Contained hero",
    height: "half",
    objectFit: "contain",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Using objectFit='contain' shows the entire image without cropping. Background color visible in letterbox areas.",
      },
    },
  },
};

/**
 * Hero image with custom object position.
 * Useful when the image subject is not centered.
 */
export const CustomPosition: Story = {
  args: {
    src: PLACEHOLDER_IMAGE,
    alt: "Top-aligned hero",
    height: "half",
    objectPosition: "top",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use objectPosition to control which part of the image is visible when cropped.",
      },
    },
  },
};
