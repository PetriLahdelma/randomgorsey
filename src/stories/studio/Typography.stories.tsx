import type { Meta, StoryObj } from "@storybook/react";

function TypographySpecimen() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto" }}>
      <p className="studioKicker">Random Gorsey · Helsinki</p>
      <h1 className="studioTitle">Work before claims.</h1>
      <p className="studioLead">
        A restrained artist identity, one real work, and one unambiguous way to
        listen. The editorial voice remains readable while the interface stays
        precise.
      </p>

      <section className="studioSection" aria-labelledby="system-type">
        <h2 id="system-type" style={{ textTransform: "none" }}>
          System role
        </h2>
        <div
          style={{
            display: "grid",
            gap: "12px",
            maxWidth: "720px",
            padding: "24px",
            color: "var(--studio-ink)",
            background: "var(--studio-paper)",
          }}
        >
          <p className="studioMeta" style={{ margin: 0 }}>
            PLAY · PAUSE · 00:00 / 06:14
          </p>
          <p className="studioMeta" style={{ margin: 0 }}>
            FIRGO2100004 · RDGY 01 · 2021
          </p>
          <p className="studioMeta" style={{ margin: 0 }}>
            Ä Å Ö É — “quotes” / punctuation + fallback
          </p>
        </div>
      </section>

      <section
        className="studioSection studioText"
        aria-labelledby="reading-type"
      >
        <h2 id="reading-type" style={{ textTransform: "none" }}>
          Reading role
        </h2>
        <p>
          Opened the blinds after lunch and the sun was still up. Not setting,
          not just a pale strip on the horizon. Properly up. Golden light on
          the buildings, people walking without hunching.
        </p>
      </section>
    </main>
  );
}

const meta = {
  title: "Foundations/Typography",
  component: TypographySpecimen,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TypographySpecimen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Roles: Story = {};

export const MobileReflow: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};

export const MinimumReflow: Story = {
  parameters: {
    viewport: { defaultViewport: "narrow" },
  },
};
