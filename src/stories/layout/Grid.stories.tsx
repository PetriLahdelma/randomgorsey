import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "@/components/layout";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Responsive grid with container query support. Responds to container width, not viewport width, making it context-aware.",
      },
    },
  },
  argTypes: {
    gap: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
      description: "Gap between grid items",
    },
    columns: {
      control: { type: "select" },
      options: ["auto", "1", "2", "3", "4"],
      description: "Column mode (auto uses container queries)",
    },
    minItemWidth: {
      control: { type: "text" },
      description: "Min width for auto-fit (e.g., 250px)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Demo card component
const DemoCard = ({ n }: { n: number }) => (
  <div className="bg-muted p-4 rounded-lg text-center">
    <div className="text-2xl font-bold mb-2">{n}</div>
    <div className="text-sm text-muted-foreground">Grid Item</div>
  </div>
);

export const Default: Story = {
  args: {
    gap: "md",
    columns: "auto",
  },
  render: (args) => (
    <Grid {...args}>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <DemoCard key={n} n={n} />
      ))}
    </Grid>
  ),
};

export const FixedColumns: Story = {
  render: () => (
    <div className="space-y-8">
      {(["1", "2", "3", "4"] as const).map((columns) => (
        <div key={columns}>
          <p className="text-sm text-muted-foreground mb-2">
            columns="{columns}"
          </p>
          <Grid columns={columns} gap="md">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <DemoCard key={n} n={n} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Fixed column counts that don't respond to container width.",
      },
    },
  },
};

export const AutoFit: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        minItemWidth="200px" - items stretch to fill row, min 200px each
      </p>
      <Grid minItemWidth="200px" gap="md">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <DemoCard key={n} n={n} />
        ))}
      </Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Auto-fit grid with minimum item width using CSS minmax().",
      },
    },
  },
};

export const GapScale: Story = {
  render: () => (
    <div className="space-y-8">
      {(["sm", "md", "lg", "xl"] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap="{gap}"</p>
          <Grid columns="3" gap={gap}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <DemoCard key={n} n={n} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available gap sizes from sm to xl.",
      },
    },
  },
};

export const ContainerQueryDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold">Container Query Responsive Grid</h3>
        <p className="text-sm text-muted-foreground">
          Resize the container below by dragging the right edge. The grid
          responds to its container width, not the viewport - making it work
          correctly in sidebars, modals, and other constrained contexts.
        </p>
      </div>

      <div
        className="resize-x overflow-auto border-2 border-dashed border-muted rounded-lg p-4"
        style={{ width: "100%", minWidth: "200px", maxWidth: "100%" }}
      >
        <Grid columns="auto" gap="md">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <DemoCard key={n} n={n} />
          ))}
        </Grid>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Breakpoints:</strong> 1 col → 2 cols (@sm:320px) → 3 cols
          (@lg:640px) → 4 cols (@xl:960px)
        </p>
        <p>
          Note: These are container query breakpoints, not viewport breakpoints.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing container query responsiveness. Drag the container edge to resize.",
      },
    },
  },
};

export const SidebarContext: Story = {
  render: () => (
    <div className="flex gap-6">
      {/* Simulated sidebar */}
      <div className="w-64 shrink-0 space-y-4">
        <h3 className="font-semibold">Narrow Sidebar</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Grid adapts to narrow container
        </p>
        <Grid columns="auto" gap="sm">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-muted p-2 rounded text-center text-sm"
            >
              {n}
            </div>
          ))}
        </Grid>
      </div>

      {/* Main content area */}
      <div className="flex-1 space-y-4">
        <h3 className="font-semibold">Main Content Area</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Same Grid component, more space = more columns
        </p>
        <Grid columns="auto" gap="md">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <DemoCard key={n} n={n} />
          ))}
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Same Grid component behaves differently based on container context.",
      },
    },
  },
};

export const CardGallery: Story = {
  render: () => (
    <Grid columns="auto" gap="lg">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div
            className="h-32 bg-gradient-to-br from-accent/20 to-accent/40"
            style={{ background: `hsl(${n * 40}, 50%, 85%)` }}
          />
          <div className="p-4 space-y-2">
            <h4 className="font-semibold">Card Title {n}</h4>
            <p className="text-sm text-muted-foreground">
              Card description with some sample text content.
            </p>
          </div>
        </div>
      ))}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world card gallery using container-responsive Grid.",
      },
    },
  },
};
