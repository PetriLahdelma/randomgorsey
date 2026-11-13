import type { Meta, StoryObj } from "@storybook/react";
import { PerformanceProvider } from "@/lib/performance";
import About from "@/site/About";
import styles from "./AboutPortraitEffects.module.css";

function AboutPortraitPreview({ effect }: { effect: "interlaced" | "redLines" | "redLinesSoft" }) {
  return (
    <PerformanceProvider>
      <div className={`${styles.preview} ${styles[effect]}`}>
        <About />
      </div>
    </PerformanceProvider>
  );
}

const meta = {
  title: "Demos/About Portrait",
  component: AboutPortraitPreview,
  args: {
    effect: "interlaced",
  },
  argTypes: {
    effect: {
      control: "select",
      options: ["interlaced", "redLines", "redLinesSoft"],
      description: "Applies the selected scan treatment around the production About portrait.",
      table: { defaultValue: { summary: "interlaced" } },
    },
  },
  parameters: {
    layout: "fullscreen",
    nextjs: { navigation: { pathname: "/about/" } },
    docs: { description: { component: "Visual comparison using the About page and its portrait loop. Interlaced is selected for the page; the red variants are experiments." } },
  },
} satisfies Meta<typeof AboutPortraitPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interlaced: Story = { args: { effect: "interlaced" } };
export const RedTwoPixelLines: Story = { args: { effect: "redLines" } };
export const RedTwoPixelLinesSoft: Story = { args: { effect: "redLinesSoft" } };
