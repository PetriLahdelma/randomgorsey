import type { Meta, StoryObj } from "@storybook/react";
import Discography from "@/site/Discography";

function ReleaseWindow() {
  return <Discography />;
}

const meta = {
  title: "Production/Compositions/Release",
  component: ReleaseWindow,
  parameters: {
    layout: "fullscreen",
    nextjs: { navigation: { pathname: "/discography/" } },
    docs: {
      description: {
        component: "The shipped Discography composition with original square artwork and overlapping information windows.",
      },
    },
  },
} satisfies Meta<typeof ReleaseWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CatalogSurface: Story = {};
