import type { Preview } from "@storybook/react";
import type { CSSProperties } from "react";
import "../src/app/globals.css";

const canvasStyle = {
  "--font-geist-pixel-square": "\"Courier New\", monospace",
  boxSizing: "border-box",
  minHeight: "100vh",
  color: "var(--studio-white)",
  background: "var(--studio-stage)",
} as CSSProperties;

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <div
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
            role="note"
            style={{
              padding: "0.65rem 0.85rem",
              marginBottom: "1.25rem",
              color: "var(--studio-ink)",
              background: "var(--studio-gray)",
              border: "2px solid",
              borderColor: "#fff #6f706b #6f706b #fff",
              fontFamily: "var(--studio-system)",
              fontSize: "0.75rem",
              lineHeight: 1.4,
            }}
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
          ["Coverage", "Foundations", "Navigation", "Journal", "Player", "Privacy", "Surfaces"],
          "Studio",
          "Foundations",
          "Effects",
          "Components",
          "Library",
          ["Layout", "Legacy"],
          "Laboratory",
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
