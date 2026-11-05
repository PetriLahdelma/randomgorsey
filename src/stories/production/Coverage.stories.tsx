import type { Meta, StoryObj } from "@storybook/react";

const rows = [
  ["Navigation", "Full", "Header, mobile menu, footer and external-link treatment"],
  ["Home + Journal", "Full surface", "Hero, selected release, real latest posts and archive views"],
  ["Listen", "Full surface", "Source console, energetic artwork and persistent player lifecycle"],
  ["Discography", "Full surface", "Real releases, square artwork, overlap, tracklists and destinations"],
  ["About", "Full surface", "Portrait loop, reduced-motion still, biography and aliases"],
  ["Gallery", "Full surface", "All current image windows and interactive viewer"],
  ["Contact", "Full surface", "Inquiry selection and form UI; delivery is not invoked in stories"],
  ["Privacy", "Full component", "First-visit panel and reopen control"],
  ["Journal entry", "Full component", "Current PostCard with real authored content"],
  ["Share menu", "Full component", "Production journal share control, including keyboard and copy states"],
  ["Page header", "Full component", "Shared production header for Listen, Discography, About and Gallery"],
  ["Foundations", "Representative", "Type, links, controls, metadata, window tones, mark and motion"],
] as const;

function Coverage() {
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto" }}>
      <p className="studioKicker">Production parity</p>
      <h1 className="studioTitle">Storybook coverage</h1>
      <p className="studioLead">
        Authored production UI is represented with the live components and real
        content. Provider-owned iframe controls remain external.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", lineHeight: 1.5 }}>
          <thead>
            <tr>
              {['Area', 'Coverage', 'Evidence'].map((label) => (
                <th key={label} scope="col" style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid var(--studio-line)" }}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([area, coverage, evidence]) => (
              <tr key={area}>
                <th scope="row" style={{ padding: "12px 10px", textAlign: "left", borderBottom: "1px solid var(--studio-line)" }}>{area}</th>
                <td style={{ padding: "12px 10px", color: "var(--studio-acid)", borderBottom: "1px solid var(--studio-line)" }}>{coverage}</td>
                <td style={{ padding: "12px 10px", color: "var(--studio-muted)", borderBottom: "1px solid var(--studio-line)" }}>{evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="studioMeta" style={{ marginTop: 24 }}>
        Excluded from simulation: Spotify/SoundCloud internals and live EmailJS delivery.
      </p>
    </main>
  );
}

const meta = {
  title: "Production/Coverage",
  component: Coverage,
} satisfies Meta<typeof Coverage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inventory: Story = {};
