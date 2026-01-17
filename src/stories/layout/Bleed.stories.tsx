import type { Meta, StoryObj } from "@storybook/react";
import { Bleed, Container } from "@/components/layout";

const meta: Meta<typeof Bleed> = {
  title: "Layout/Bleed",
  component: Bleed,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Breaks content out of contained layouts to full viewport width. Useful for hero images, full-bleed banners, and emphasized sections.",
      },
    },
  },
  argTypes: {
    as: {
      control: { type: "text" },
      description: "HTML element to render as (e.g., section, figure)",
    },
  },
  decorators: [
    (Story) => (
      <Container size="md" padding="md">
        <div className="space-y-6 py-8">
          <div className="bg-muted/50 p-4 rounded">
            <p>Content inside Container (max-width constrained)</p>
          </div>
          <Story />
          <div className="bg-muted/50 p-4 rounded">
            <p>More contained content after the Bleed</p>
          </div>
        </div>
      </Container>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Bleed>
      <div className="bg-accent py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-accent-foreground">
          Full-Bleed Section
        </h2>
        <p className="text-accent-foreground/80 mt-2">
          This content breaks out of the container to span full viewport width
        </p>
      </div>
    </Bleed>
  ),
};

export const HeroImage: Story = {
  render: () => (
    <Bleed as="figure">
      <div
        className="h-64 bg-cover bg-center"
        style={{
          background:
            "linear-gradient(135deg, hsl(220, 60%, 30%) 0%, hsl(260, 60%, 40%) 100%)",
        }}
      >
        <div className="h-full flex items-center justify-center">
          <p className="text-white text-xl font-semibold">
            Full-width hero image area
          </p>
        </div>
      </div>
      <figcaption className="bg-muted/80 px-4 py-2 text-center text-sm text-muted-foreground">
        Image caption spans full width
      </figcaption>
    </Bleed>
  ),
  parameters: {
    docs: {
      description: {
        story: "Hero image with caption using semantic figure element.",
      },
    },
  },
};

export const CallToAction: Story = {
  render: () => (
    <Bleed>
      <div className="bg-primary py-16 px-4">
        <Container size="sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Ready to get started?
            </h2>
            <p className="text-primary-foreground/80">
              Join thousands of artists showcasing their work
            </p>
            <button className="bg-background text-foreground px-8 py-3 rounded-md font-medium hover:bg-background/90 transition-colors">
              Get Started Free
            </button>
          </div>
        </Container>
      </div>
    </Bleed>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full-bleed CTA section with centered content using nested Container.",
      },
    },
  },
};

export const AlternatingPattern: Story = {
  render: () => (
    <Bleed>
      <div className="divide-y divide-border">
        <div className="bg-muted/30 py-8">
          <Container size="md" padding="md">
            <h3 className="font-semibold mb-2">Section One</h3>
            <p className="text-muted-foreground">
              Alternating full-bleed backgrounds create visual rhythm.
            </p>
          </Container>
        </div>
        <div className="bg-background py-8">
          <Container size="md" padding="md">
            <h3 className="font-semibold mb-2">Section Two</h3>
            <p className="text-muted-foreground">
              Content stays constrained while background bleeds.
            </p>
          </Container>
        </div>
        <div className="bg-muted/30 py-8">
          <Container size="md" padding="md">
            <h3 className="font-semibold mb-2">Section Three</h3>
            <p className="text-muted-foreground">
              This pattern is common in landing pages.
            </p>
          </Container>
        </div>
      </div>
    </Bleed>
  ),
  parameters: {
    docs: {
      description: {
        story: "Alternating full-bleed sections with constrained content.",
      },
    },
  },
};

export const QuoteHighlight: Story = {
  render: () => (
    <Bleed as="aside">
      <blockquote className="bg-accent/10 border-l-4 border-accent py-8 px-4">
        <Container size="md">
          <p className="text-xl italic text-foreground/90">
            "Music and art have always been intertwined - each inspiring the
            other in ways we're only beginning to understand."
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">
            - Random Gorsey
          </footer>
        </Container>
      </blockquote>
    </Bleed>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pull quote breaking out of content flow for emphasis.",
      },
    },
  },
};
