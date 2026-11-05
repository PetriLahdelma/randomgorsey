import type { Meta, StoryObj } from "@storybook/react";
import { StudioWindow } from "@/components/studio/StudioWindow";

function InterfaceLanguage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto" }}>
      <header className="studioPageHeader" style={{ paddingInline: 0 }}>
        <p className="studioKicker">Current production language</p>
        <h1 className="studioTitle">Interface states</h1>
        <p className="studioLead">Page titles, actions, links, metadata and window chrome used by the live site.</p>
      </header>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <StudioWindow title="Controls" tone="paper">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button type="button" className="studioButton">Primary action</button>
            <button type="button" className="studioButton" disabled>Unavailable</button>
          </div>
        </StudioWindow>
        <StudioWindow title="Links / external" tone="dark">
          <div style={{ display: "grid", gap: 14 }}>
            <a className="studioLink" href="https://randomgorsey.bandcamp.com" target="_blank" rel="noreferrer">
              <span>Bandcamp</span><span aria-hidden="true">↗</span>
            </a>
            <span className="studioMeta">FIRGO2100004 · 2021</span>
          </div>
        </StudioWindow>
        <StudioWindow title="Active state" tone="blue" actions={<span>LIVE</span>}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>Electric blue identifies an active window. Acid is reserved for signals and action.</p>
        </StudioWindow>
      </div>
    </main>
  );
}

const meta = {
  title: "Production/Foundations/InterfaceLanguage",
  component: InterfaceLanguage,
} satisfies Meta<typeof InterfaceLanguage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentStates: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
