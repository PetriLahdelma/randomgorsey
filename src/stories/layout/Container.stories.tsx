import type { Meta, StoryObj } from "@storybook/react";
import { Container, Bleed } from "@/components/layout";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Constrains content width with horizontal padding. Centers content and provides consistent max-widths for layouts.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl", "2xl", "prose", "full"],
      description: "Maximum width constraint",
    },
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
      description: "Horizontal padding",
    },
    as: {
      control: { type: "text" },
      description: "HTML element to render as (e.g., main, article)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "xl",
    padding: "md",
  },
  render: (args) => (
    <div className="bg-muted/30 py-8">
      <Container {...args}>
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-2">Default Container</h2>
          <p className="text-muted-foreground">
            This content is constrained to max-w-screen-xl (1280px) with md
            horizontal padding (1.5rem). The container is centered on the page.
          </p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeScale: Story = {
  render: () => (
    <div className="space-y-4 py-8">
      {(["sm", "md", "lg", "xl", "2xl", "prose", "full"] as const).map(
        (size) => (
          <div key={size} className="bg-muted/20">
            <Container size={size} padding="md">
              <div className="bg-accent/20 p-4 rounded border border-accent/30">
                <code className="text-sm font-mono">size="{size}"</code>
                <p className="text-xs text-muted-foreground mt-1">
                  {size === "sm" && "max-w-screen-sm (640px)"}
                  {size === "md" && "max-w-screen-md (768px)"}
                  {size === "lg" && "max-w-screen-lg (1024px)"}
                  {size === "xl" && "max-w-screen-xl (1280px)"}
                  {size === "2xl" && "max-w-screen-2xl (1536px)"}
                  {size === "prose" && "max-w-prose (~65ch)"}
                  {size === "full" && "max-w-full (no constraint)"}
                </p>
              </div>
            </Container>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available size options with their max-width values.",
      },
    },
  },
};

export const PaddingScale: Story = {
  render: () => (
    <div className="space-y-4 py-8 bg-muted/30">
      {(["none", "sm", "md", "lg"] as const).map((padding) => (
        <Container key={padding} size="md" padding={padding}>
          <div className="bg-background p-4 rounded border border-border">
            <code className="text-sm font-mono">padding="{padding}"</code>
            <p className="text-xs text-muted-foreground mt-1">
              {padding === "none" && "px-0 (0)"}
              {padding === "sm" && "px-4 (1rem)"}
              {padding === "md" && "px-6 (1.5rem)"}
              {padding === "lg" && "px-8 (2rem)"}
            </p>
          </div>
        </Container>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal padding options for edge spacing.",
      },
    },
  },
};

export const Prose: Story = {
  render: () => (
    <div className="py-8 bg-muted/20">
      <Container size="prose" padding="md">
        <article className="space-y-4">
          <h1 className="text-3xl font-bold">Article Title</h1>
          <p className="text-muted-foreground">
            Published on January 17, 2026
          </p>
          <p>
            The prose container width (~65 characters per line) is optimized for
            reading. Studies have shown that 50-75 characters per line is the
            ideal measure for comfortable reading on screen.
          </p>
          <p>
            This makes it perfect for blog posts, articles, and long-form
            content where readability is the priority. The content automatically
            centers on larger screens while maintaining comfortable line lengths.
          </p>
          <p>
            Notice how the text doesn't stretch across the entire viewport even
            on wide screens - this is intentional and makes the content much
            easier to read.
          </p>
        </article>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Prose width optimized for reading (~65 characters per line).",
      },
    },
  },
};

export const NestedWithBleed: Story = {
  render: () => (
    <Container size="md" padding="md" className="py-8">
      <div className="space-y-6">
        <div className="p-4 bg-muted/50 rounded">
          <h2 className="font-semibold">Regular Contained Content</h2>
          <p className="text-sm text-muted-foreground">
            This content respects the container width.
          </p>
        </div>

        <Bleed>
          <div className="bg-accent py-8 px-4">
            <Container size="md">
              <h2 className="font-semibold text-accent-foreground">
                Full-Bleed Section
              </h2>
              <p className="text-sm text-accent-foreground/80">
                This breaks out to full width while keeping inner content
                aligned with the outer container.
              </p>
            </Container>
          </div>
        </Bleed>

        <div className="p-4 bg-muted/50 rounded">
          <h2 className="font-semibold">Back to Contained Content</h2>
          <p className="text-sm text-muted-foreground">
            Content returns to normal container width.
          </p>
        </div>
      </div>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Container with Bleed child - the canonical pattern for full-width breakouts.",
      },
    },
  },
};

export const AsMain: Story = {
  render: () => (
    <Container as="main" size="lg" padding="md" className="py-8">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Main Content Area</h1>
          <p className="text-muted-foreground">
            Using semantic main element for accessibility
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Section One</h2>
          <p className="text-muted-foreground">
            The Container component supports polymorphic rendering via the "as"
            prop, allowing you to use semantic HTML elements while maintaining
            the layout behavior.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Section Two</h2>
          <p className="text-muted-foreground">
            This improves accessibility by providing proper document structure
            for screen readers and other assistive technologies.
          </p>
        </section>
      </div>
    </Container>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Polymorphic rendering with as="main" for semantic HTML.',
      },
    },
  },
};

export const PageLayout: Story = {
  render: () => (
    <div className="min-h-[600px] flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <Container size="xl" padding="md">
          <div className="h-16 flex items-center justify-between">
            <span className="font-bold">Logo</span>
            <nav className="space-x-6">
              <a href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </nav>
          </div>
        </Container>
      </header>

      {/* Main */}
      <Container as="main" size="xl" padding="md" className="flex-1 py-12">
        <h1 className="text-4xl font-bold mb-4">Page Title</h1>
        <p className="text-muted-foreground mb-8">
          Consistent Container usage across page sections creates visual
          alignment.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-muted p-6 rounded-lg">
              Card {n}
            </div>
          ))}
        </div>
      </Container>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <Container size="xl" padding="md">
          <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">
            Footer content aligned with header and main
          </div>
        </Container>
      </footer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full page layout using Container for consistent alignment across header, main, and footer.",
      },
    },
  },
};
