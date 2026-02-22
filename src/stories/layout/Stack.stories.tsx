import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "@/components/layout";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Arranges children vertically with consistent gap spacing. Supports polymorphic rendering for semantic HTML.",
      },
    },
  },
  argTypes: {
    gap: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "section"],
      description: "Gap between children",
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end", "stretch"],
      description: "Cross-axis alignment",
    },
    as: {
      control: { type: "text" },
      description: "HTML element to render as (e.g., section, article, nav)",
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Demo box component for visual clarity
const DemoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-muted p-4 rounded text-center">{children}</div>
);

export const Default: Story = {
  args: {
    gap: "md",
    align: "stretch",
  },
  render: (args) => (
    <Stack {...args}>
      <DemoBox>Item 1</DemoBox>
      <DemoBox>Item 2</DemoBox>
      <DemoBox>Item 3</DemoBox>
    </Stack>
  ),
};

export const GapScale: Story = {
  render: () => (
    <div className="space-y-8">
      {(
        ["none", "xs", "sm", "md", "lg", "xl", "2xl", "section"] as const
      ).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap="{gap}"</p>
          <Stack gap={gap}>
            <DemoBox>A</DemoBox>
            <DemoBox>B</DemoBox>
            <DemoBox>C</DemoBox>
          </Stack>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available gap sizes from none to section.",
      },
    },
  },
};

export const Alignment: Story = {
  render: () => (
    <div className="space-y-8">
      {(["start", "center", "end", "stretch"] as const).map((align) => (
        <div key={align}>
          <p className="text-sm text-muted-foreground mb-2">align="{align}"</p>
          <Stack align={align} gap="sm" className="bg-muted/30 p-4 rounded">
            <div className="bg-accent text-accent-foreground px-4 py-2 rounded">
              Short
            </div>
            <div className="bg-accent text-accent-foreground px-8 py-2 rounded">
              Medium width
            </div>
            <div className="bg-accent text-accent-foreground px-2 py-2 rounded">
              A
            </div>
          </Stack>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Cross-axis alignment options for stack children.",
      },
    },
  },
};

export const AsSection: Story = {
  render: () => (
    <Stack as="section" gap="lg" className="bg-muted/20 p-6 rounded-lg">
      <header>
        <h2 className="text-2xl font-bold">Section Title</h2>
      </header>
      <p className="text-muted-foreground">
        This Stack renders as a semantic section element. The polymorphic as
        prop allows you to use Stack for semantic HTML structure while
        maintaining the layout behavior.
      </p>
      <footer className="text-sm text-muted-foreground">
        Section footer
      </footer>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates polymorphic rendering with as="section".',
      },
    },
  },
};

export const RealWorldExample: Story = {
  render: () => (
    <Stack gap="lg">
      <Stack gap="xs">
        <h1 className="text-3xl font-bold">Page Title</h1>
        <p className="text-muted-foreground">
          A brief description of the page content
        </p>
      </Stack>

      <Stack as="article" gap="md" className="border-l-2 border-accent pl-4">
        <h2 className="text-xl font-semibold">Article Section</h2>
        <p>
          Stack can be nested to create hierarchical content layouts with
          consistent spacing at each level.
        </p>
        <Stack gap="sm">
          <DemoBox>Nested item 1</DemoBox>
          <DemoBox>Nested item 2</DemoBox>
        </Stack>
      </Stack>

      <Stack gap="sm" align="center">
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md">
          Primary Action
        </button>
        <span className="text-sm text-muted-foreground">
          Secondary information
        </span>
      </Stack>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: "Nested Stack components for complex page layouts.",
      },
    },
  },
};
