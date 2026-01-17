import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Scene3D } from "@/components/effects";

const meta: Meta<typeof Scene3D> = {
  title: "Effects/Scene3D",
  component: Scene3D,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "React Three Fiber Canvas wrapper with automatic performance scaling. Returns null on tier 0 or devices without WebGL support. Uses on-demand frame loop for battery efficiency.",
      },
    },
  },
  argTypes: {
    overlay: {
      control: "boolean",
      description: "Whether scene is absolute positioned overlay",
    },
    dpr: {
      control: { type: "range", min: 0.5, max: 2, step: 0.5 },
      description:
        "Initial DPR (device pixel ratio), auto-adjusts based on performance tier",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Scene3D>;

/**
 * Simple rotating cube as demo content for the 3D scene.
 */
const RotatingCube = ({ color = "hotpink" }: { color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

/**
 * Default Scene3D with a rotating cube.
 * Performance tier determines DPR and antialiasing quality.
 */
export const Default: Story = {
  render: (args) => (
    <div className="h-[400px] w-full bg-gray-900">
      <Scene3D {...args}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube />
      </Scene3D>
    </div>
  ),
  args: {
    overlay: false,
  },
};

/**
 * Scene3D as an overlay positioned absolutely behind content.
 * Common pattern for 3D backgrounds on hero sections.
 */
export const AsOverlay: Story = {
  render: (args) => (
    <div className="relative h-[400px] w-full">
      <div className="flex h-full items-center justify-center bg-gray-800">
        <h2 className="text-4xl font-bold text-white">Content with 3D overlay</h2>
      </div>
      <Scene3D {...args}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube color="#ffd600" />
      </Scene3D>
    </div>
  ),
  args: {
    overlay: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "With overlay=true, the Scene3D is positioned absolutely behind the content. The pointer-events-none class can be added to prevent interaction.",
      },
    },
  },
};

/**
 * Custom DPR override.
 * Normally DPR is auto-scaled by tier (tier 1: 1, tier 2: 1.5, tier 3: 2).
 */
export const CustomDPR: Story = {
  render: (args) => (
    <div className="h-[400px] w-full bg-gray-900">
      <Scene3D {...args}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube color="#00ff88" />
      </Scene3D>
    </div>
  ),
  args: {
    overlay: false,
    dpr: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Override the automatic DPR scaling with a custom value. Higher DPR = sharper rendering but more GPU load.",
      },
    },
  },
};

/**
 * Performance tiers explanation.
 * Scene3D automatically adjusts quality based on detected GPU capability.
 */
export const PerformanceTiers: Story = {
  render: (args) => (
    <div className="space-y-4">
      <div className="rounded bg-muted p-4 text-sm">
        <h3 className="font-bold mb-2">Performance Tier Behavior:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Tier 0:</strong> Returns null (no 3D rendering)
          </li>
          <li>
            <strong>Tier 1:</strong> DPR 1, no antialiasing
          </li>
          <li>
            <strong>Tier 2:</strong> DPR 1.5, antialiasing enabled
          </li>
          <li>
            <strong>Tier 3:</strong> DPR 2, antialiasing enabled
          </li>
        </ul>
      </div>
      <div className="h-[300px] w-full bg-gray-900">
        <Scene3D {...args}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingCube color="#ff6b6b" />
        </Scene3D>
      </div>
    </div>
  ),
  args: {
    overlay: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scene3D uses usePerformance() hook to detect GPU tier and automatically scale rendering quality.",
      },
    },
  },
};
