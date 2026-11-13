import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useState } from "react";

import styles from "./Foundations.module.css";

const colors = [
  ["Canvas", "--component-surface-canvas"],
  ["Layer", "--component-surface-layer"],
  ["Panel", "--component-surface-panel"],
  ["Field", "--component-surface-field"],
  ["Action", "--ds-color-signal-blue"],
  ["Signal", "--ds-color-signal-acid"],
] as const;

const spaces = ["--ds-space-1", "--ds-space-2", "--ds-space-3", "--ds-space-4", "--ds-space-6", "--ds-space-8"] as const;

function ResolvedToken({ name }: { name: string }) {
  const [value] = useState(() =>
    typeof document === "undefined"
      ? `var(${name})`
      : getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  );

  return <span className={styles.tokenValue}>{value}</span>;
}

function Header({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lead}>{lead}</p>
    </header>
  );
}

function SectionHeader({ index, children }: { index: string; children: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionIndex}>{index}</span>
      <h2 className={styles.sectionTitle}>{children}</h2>
    </div>
  );
}

function ColorSystem() {
  return (
    <main className={styles.page}>
      <Header eyebrow="Foundations / 01" title="Layer before decoration." lead="The productive interface uses a small, token-derived surface model. Electric blue communicates operation; acid is reserved for signal and emphasis." />
      <section className={styles.section}>
        <SectionHeader index="01">Surface and signal roles</SectionHeader>
        <div className={styles.swatchGrid}>
          {colors.map(([label, token]) => (
            <article className={styles.swatch} key={token}>
              <span className={styles.swatchSample} style={{ background: `var(${token})` }} />
              <div className={styles.tokenData}>
                <strong>{label}</strong>
                <code className={styles.tokenName}>{token}</code>
                <ResolvedToken name={token} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function TypographySystem() {
  return (
    <main className={styles.page}>
      <Header eyebrow="Foundations / 02" title="Three roles. Clear ownership." lead="Sans supports productive reading, mono carries data and system metadata, and Lisa Terminal stays attached to the artist shell and short expressive labels." />
      <section className={styles.section}>
        <SectionHeader index="01">Type roles</SectionHeader>
        <div className={styles.typeGrid}>
          <article className={styles.specimen}><span className={styles.terminal}>SIGNAL_09</span><code className={styles.tokenName}>--ds-font-family-terminal</code><p>Expressive artifact / short labels</p></article>
          <article className={styles.specimen}><span className={styles.sans}>Productive interface</span><code className={styles.tokenName}>--ds-font-family-sans</code><p>Controls, descriptions and body text</p></article>
          <article className={styles.specimen}><span className={styles.mono}>2026-11-13T16:42:19+02:00</span><code className={styles.tokenName}>--ds-font-family-mono</code><p>IDs, timestamps and state metadata</p></article>
        </div>
      </section>
    </main>
  );
}

function DensitySystem() {
  return (
    <main className={styles.page}>
      <Header eyebrow="Foundations / 03" title="A four-pixel rhythm." lead="Spacing is compact and regular. Components use the same scale so density remains predictable across fields, dialogs and structural layouts." />
      <section className={styles.section}>
        <SectionHeader index="01">Spacing scale</SectionHeader>
        <div className={styles.scale}>
          {spaces.map((token) => (
            <div className={styles.spaceUnit} key={token}>
              <span className={styles.spaceBar} style={{ "--measure": `var(${token})` } as CSSProperties} />
              <code className={styles.tokenName}>{token.replace("--ds-space-", "")}</code>
              <ResolvedToken name={token} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function MotionAndFocusSystem() {
  return (
    <main className={styles.page}>
      <Header eyebrow="Foundations / 04" title="State has a precise edge." lead="Entrances use the 200ms ease-out contract, exits are shorter, and focus is measured against the surface beneath it. Coarse pointer and reduced-motion modes settle immediately." />
      <section className={styles.section}>
        <SectionHeader index="01">Motion contract</SectionHeader>
        <div className={styles.motionGrid}>
          <article className={styles.motionCard}><strong>Entrance</strong><div className={styles.motionTrack}><span className={styles.motionObject} /></div><code className={styles.rule}>200ms · ease-out</code></article>
          <article className={styles.motionCard}><strong>Exit</strong><p>Exits complete in 80% of the entrance duration.</p><code className={styles.rule}>160ms · deterministic</code></article>
        </div>
      </section>
      <section className={styles.section}>
        <SectionHeader index="02">Focus by surface</SectionHeader>
        <div className={styles.focusGrid}>
          <article className={styles.focusCard}><strong>Paper</strong><button className={styles.focusTarget} autoFocus>Keyboard target</button><code className={styles.rule}>--component-control-focus</code></article>
          <article className={`${styles.focusCard} ${styles.darkFocus}`}><strong style={{ color: "var(--component-text-on-dark)" }}>Graphite</strong><button className={styles.focusTarget}>Keyboard target</button><code className={styles.rule} style={{ color: "var(--component-text-on-dark)" }}>--component-control-focus-on-dark</code></article>
        </div>
      </section>
    </main>
  );
}

const meta = {
  title: "Foundations/System",
  component: ColorSystem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Generated component-library foundations. Values are resolved from the checked-in CSS custom properties; the live artist-shell tokens remain separately owned.",
      },
    },
  },
} satisfies Meta<typeof ColorSystem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorAndLayers: Story = {};
export const Typography: Story = { render: () => <TypographySystem /> };
export const SpacingAndDensity: Story = { render: () => <DensitySystem /> };
export const FocusAndMotion: Story = { render: () => <MotionAndFocusSystem /> };
