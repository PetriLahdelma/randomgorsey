import type { Meta, StoryObj } from "@storybook/react";

const experiments = [
  ["AnimatedHeading", "Character-reveal heading", "No production consumer"],
  ["GlitchLink", "Distorted link treatment", "No production consumer"],
  ["RevealOnScroll", "Viewport entrance experiment", "No production consumer"],
  ["AmbientLayer", "Reactive ambient layer", "No production consumer"],
  ["CursorTrail", "Pointer-trail study", "No production consumer"],
  ["HeroImage", "Full-bleed image utility", "No production consumer"],
  ["NoiseShimmer", "Loading and degradation texture", "No production consumer"],
  ["ParticleField", "WebGL particle study", "No production consumer"],
  ["ScanLineReveal", "Scan-line reveal", "No production consumer"],
  ["Scene3D", "Three.js scene wrapper", "No production consumer"],
  ["VideoBackground", "Full-bleed video utility", "No production consumer"],
] as const;

function Registry() {
  return (
    <main style={{ width: "min(100%, 980px)", marginInline: "auto" }}>
      <header style={{ display: "grid", gap: "var(--ds-space-3)", marginBlockEnd: "var(--ds-space-8)" }}>
        <p style={{ margin: 0, color: "var(--ds-color-signal-acid)", fontFamily: "var(--ds-font-family-mono)", fontSize: "var(--ds-font-size-meta)" }}>LABORATORY / OWNERSHIP</p>
        <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 400, letterSpacing: "-0.05em" }}>Experiments remain explicit.</h1>
        <p style={{ maxWidth: "64ch", margin: 0, color: "var(--ds-color-neutral-400)", lineHeight: 1.6 }}>These utilities may inform future work. They are retained for controlled experiments and carry no production-readiness claim.</p>
      </header>
      <div style={{ border: "var(--ds-border-width-hairline) solid var(--ds-color-neutral-600)" }}>
        {experiments.map(([name, purpose, owner], index) => (
          <article key={name} style={{ display: "grid", gridTemplateColumns: "40px minmax(150px, 0.6fr) 1fr minmax(160px, 0.7fr)", gap: "var(--ds-space-4)", padding: "var(--ds-space-4)", borderBlockEnd: index < experiments.length - 1 ? "var(--ds-border-width-hairline) solid var(--ds-color-neutral-600)" : undefined }}>
            <span style={{ color: "var(--ds-color-neutral-400)", fontFamily: "var(--ds-font-family-mono)", fontSize: "var(--ds-font-size-meta)" }}>{String(index + 1).padStart(2, "0")}</span>
            <strong>{name}</strong><span style={{ color: "var(--ds-color-neutral-400)" }}>{purpose}</span><span style={{ color: "var(--ds-color-neutral-400)", fontFamily: "var(--ds-font-family-mono)", fontSize: "var(--ds-font-size-meta)" }}>{owner}</span>
          </article>
        ))}
      </div>
    </main>
  );
}

const meta = {
  title: "Laboratory/Registry",
  component: Registry,
  parameters: {
    docs: { description: { component: "Purpose and ownership for retained experiments. Direct rendering stories remain separate and carry the same Laboratory warning." } },
  },
} satisfies Meta<typeof Registry>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Ownership: Story = {};
