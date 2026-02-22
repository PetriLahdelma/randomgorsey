import type { Meta, StoryObj } from "@storybook/react";
import { Scene3D, ParticleField } from "@/components/effects";

const meta: Meta<typeof ParticleField> = {
  title: "Effects/ParticleField",
  component: ParticleField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "GPU-instanced particle system that scales particle count based on device tier. Uses drei Instances for efficient rendering. Animation respects prefers-reduced-motion.",
      },
    },
  },
  argTypes: {
    count: {
      control: { type: "range", min: 100, max: 2000, step: 100 },
      description:
        "Base particle count (scales with tier: tier1=count/4, tier2=count/2, tier3=full)",
    },
    color: {
      control: "color",
      description: "Particle color (CSS color string)",
    },
    spread: {
      control: { type: "range", min: 5, max: 20, step: 1 },
      description: "Spread area size (cube dimensions)",
    },
    size: {
      control: { type: "range", min: 0.01, max: 0.2, step: 0.01 },
      description: "Particle size (sphere radius)",
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[500px] w-full bg-black">
        <Scene3D>
          <ambientLight intensity={0.2} />
          <Story />
        </Scene3D>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ParticleField>;

/**
 * Default particle field with 1000 white particles.
 * Actual rendered count depends on GPU tier.
 */
export const Default: Story = {
  args: {
    count: 1000,
    color: "#ffffff",
    spread: 10,
    size: 0.05,
  },
};

/**
 * High density particle field.
 * With 2000 base count: tier 1 renders 500, tier 2 renders 1000, tier 3 renders 2000.
 */
export const HighDensity: Story = {
  args: {
    count: 2000,
    color: "#ffffff",
    spread: 8,
    size: 0.03,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Higher particle count with smaller size for dense starfield effect.",
      },
    },
  },
};

/**
 * Golden/yellow colored particles matching the brand accent color.
 */
export const BrandAccent: Story = {
  args: {
    count: 1000,
    color: "#ffd600",
    spread: 10,
    size: 0.05,
  },
  parameters: {
    docs: {
      description: {
        story: "Particles using the brand yellow accent color (#ffd600).",
      },
    },
  },
};

/**
 * Large particles with lower count for a bokeh-like effect.
 */
export const LargeParticles: Story = {
  args: {
    count: 500,
    color: "#00ff88",
    spread: 12,
    size: 0.1,
  },
  parameters: {
    docs: {
      description: {
        story: "Fewer, larger particles create a bokeh-like effect.",
      },
    },
  },
};

/**
 * Tight cluster of particles.
 * Smaller spread creates a concentrated particle cloud.
 */
export const TightCluster: Story = {
  args: {
    count: 800,
    color: "#ff6b6b",
    spread: 5,
    size: 0.04,
  },
  parameters: {
    docs: {
      description: {
        story: "Smaller spread value creates a concentrated particle cluster.",
      },
    },
  },
};

/**
 * Documentation story explaining tier-based scaling.
 */
export const PerformanceTiers: Story = {
  parameters: {
    docs: {
      description: {
        story: `**Particle Count Scaling by Tier:**

| Tier | Count = 1000 | Description |
|------|--------------|-------------|
| Tier 0 | 0 | No 3D (Scene3D returns null) |
| Tier 1 | 250 | Low-end GPU (count / 4) |
| Tier 2 | 500 | Mid-range GPU (count / 2) |
| Tier 3 | 1000 | High-end GPU (full count) |

The particles gently rotate on the Y-axis. Animation is paused when prefers-reduced-motion is enabled.`,
      },
    },
  },
  args: {
    count: 1000,
    color: "#ffffff",
    spread: 10,
    size: 0.05,
  },
};

/**
 * Minimal particles for subtle background effect.
 */
export const Minimal: Story = {
  args: {
    count: 200,
    color: "#cccccc",
    spread: 15,
    size: 0.03,
  },
  parameters: {
    docs: {
      description: {
        story: "Sparse particles for a subtle, non-distracting background.",
      },
    },
  },
};
