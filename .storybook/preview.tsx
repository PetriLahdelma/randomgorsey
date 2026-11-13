import type { Preview } from "@storybook/react";
import type { CSSProperties } from "react";
import "../src/app/globals.css";
import "./preview.css";

const canvasStyle = {
  "--font-geist-pixel-square": "\"Courier New\", monospace",
  boxSizing: "border-box",
  minHeight: "100vh",
  color: "var(--component-text-on-dark)",
  background: "var(--component-surface-canvas)",
} as CSSProperties;

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <div
        className="rgStoryCanvas"
        data-story-domain={context.title.split("/")[0]?.toLowerCase()}
        style={{
          ...canvasStyle,
          padding:
            context.parameters.layout === "fullscreen"
              ? 0
              : "clamp(1rem, 4vw, 4rem)",
        }}
      >
        {(context.title.startsWith("Library/Legacy") || context.title.startsWith("Laboratory")) && (
          <aside
            className="rgStoryNotice"
            role="note"
          >
            {context.title.startsWith("Laboratory")
              ? "Laboratory component — retained for experiments; not part of the current production interface."
              : "Library / legacy component — retained for reference; not used by the current production site."}
          </aside>
        )}
        <Story />
      </div>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "Production",
          ["Coverage", "Foundations", "Navigation", "Journal", "Player", "Privacy", "Surfaces", "Compositions", "Artwork"],
          "Foundations",
          ["System", "Color", "Typography", "Spacing", "Focus", "Motion"],
          "Components",
          ["Actions", "Forms", "Feedback", "Data Display", "Typography", "Dialog"],
          "Layout",
          "Studio",
          "Library",
          ["Layout", "Legacy"],
          "Laboratory",
          "Demos",
        ],
      },
    },
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
        desktop: {
          name: "Desktop · 1440 × 900",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
        wide: {
          name: "Wide · 1920 × 1080",
          styles: { width: "1920px", height: "1080px" },
          type: "desktop",
        },
      },
    },
    a11y: {
      test: "error",
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default preview;
