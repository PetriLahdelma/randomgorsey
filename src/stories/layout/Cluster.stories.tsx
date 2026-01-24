import type { Meta, StoryObj } from "@storybook/react";
import { Cluster } from "@/components/layout";

const meta: Meta<typeof Cluster> = {
  title: "Layout/Cluster",
  component: Cluster,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Arranges children horizontally with wrapping. Ideal for tag lists, button groups, and inline content.",
      },
    },
  },
  argTypes: {
    gap: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg"],
      description: "Gap between children",
    },
    justify: {
      control: { type: "select" },
      options: ["start", "center", "end", "between"],
      description: "Horizontal distribution",
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end", "baseline", "stretch"],
      description: "Vertical alignment",
    },
    as: {
      control: { type: "text" },
      description: "HTML element to render as (e.g., nav, ul)",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Demo tag component
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-muted px-3 py-1 rounded-full text-sm">{children}</span>
);

export const Default: Story = {
  args: {
    gap: "md",
    justify: "start",
    align: "center",
  },
  render: (args) => (
    <Cluster {...args}>
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag>Tailwind</Tag>
      <Tag>Vite</Tag>
    </Cluster>
  ),
};

export const GapScale: Story = {
  render: () => (
    <div className="space-y-8">
      {(["none", "xs", "sm", "md", "lg"] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap="{gap}"</p>
          <Cluster gap={gap}>
            <Tag>One</Tag>
            <Tag>Two</Tag>
            <Tag>Three</Tag>
            <Tag>Four</Tag>
          </Cluster>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available gap sizes from none to lg.",
      },
    },
  },
};

export const Justify: Story = {
  render: () => (
    <div className="space-y-8">
      {(["start", "center", "end", "between"] as const).map((justify) => (
        <div key={justify}>
          <p className="text-sm text-muted-foreground mb-2">
            justify="{justify}"
          </p>
          <Cluster justify={justify} gap="sm" className="bg-muted/30 p-4 rounded">
            <Tag>A</Tag>
            <Tag>B</Tag>
            <Tag>C</Tag>
          </Cluster>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Horizontal distribution options for cluster children.",
      },
    },
  },
};

export const Align: Story = {
  render: () => (
    <div className="space-y-8">
      {(["start", "center", "end", "baseline", "stretch"] as const).map(
        (align) => (
          <div key={align}>
            <p className="text-sm text-muted-foreground mb-2">align="{align}"</p>
            <Cluster align={align} gap="sm" className="bg-muted/30 p-4 rounded">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm">
                Small
              </span>
              <span className="bg-accent text-accent-foreground px-3 py-4 rounded text-lg">
                Tall
              </span>
              <span className="bg-accent text-accent-foreground px-3 py-2 rounded text-base">
                Medium
              </span>
            </Cluster>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Vertical alignment options for items of different heights.",
      },
    },
  },
};

export const TagList: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Skills & Technologies (wraps on smaller containers)
      </p>
      <Cluster gap="sm">
        <Tag>React</Tag>
        <Tag>TypeScript</Tag>
        <Tag>Tailwind CSS</Tag>
        <Tag>Node.js</Tag>
        <Tag>GraphQL</Tag>
        <Tag>PostgreSQL</Tag>
        <Tag>Docker</Tag>
        <Tag>AWS</Tag>
        <Tag>CI/CD</Tag>
        <Tag>Testing</Tag>
        <Tag>Accessibility</Tag>
        <Tag>Performance</Tag>
      </Cluster>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world tag/badge list that wraps naturally.",
      },
    },
  },
};

export const NavigationExample: Story = {
  render: () => (
    <Cluster as="nav" justify="between" align="center" gap="lg">
      <div className="font-bold text-lg">Logo</div>
      <Cluster gap="md">
        <a href="/" className="hover:text-accent transition-colors">
          Home
        </a>
        <a href="/about" className="hover:text-accent transition-colors">
          About
        </a>
        <a href="/work" className="hover:text-accent transition-colors">
          Work
        </a>
        <a href="/contact" className="hover:text-accent transition-colors">
          Contact
        </a>
      </Cluster>
    </Cluster>
  ),
  parameters: {
    docs: {
      description: {
        story: "Navigation bar using Cluster with justify-between.",
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <Cluster gap="sm" justify="end">
      <button className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors">
        Cancel
      </button>
      <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Save Changes
      </button>
    </Cluster>
  ),
  parameters: {
    docs: {
      description: {
        story: "Button group aligned to the end of the container.",
      },
    },
  },
};
