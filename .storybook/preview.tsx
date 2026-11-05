import type { Preview } from "@storybook/react";
import type { CSSProperties } from "react";
import "../src/app/globals.css";

const canvasStyle = {
  "--font-geist-pixel-square": "\"Courier New\", monospace",
  boxSizing: "border-box",
  minHeight: "100vh",
  padding: "clamp(1rem, 4vw, 4rem)",
} as CSSProperties;

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={canvasStyle}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "graphite",
      values: [
        { name: "graphite", value: "#101210" },
        { name: "system gray", value: "#d8d9d2" },
        { name: "ivory", value: "#f0f0e6" },
        { name: "electric blue", value: "#234bdf" },
      ],
    },
    viewport: {
      options: {
        mobile: {
          name: "Mobile · 390 × 844",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        narrow: {
          name: "Minimum · 320 × 720",
          styles: { width: "320px", height: "720px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet · 768 × 1024",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        laptop: {
          name: "Laptop · 1366 × 768",
          styles: { width: "1366px", height: "768px" },
          type: "desktop",
        },
      },
    },
    a11y: {
      test: "error",
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
