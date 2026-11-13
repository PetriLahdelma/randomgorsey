import type { Meta, StoryObj } from "@storybook/react";

import styles from "./Coverage.module.css";

type Status = "modernized" | "production-preserved" | "structural" | "laboratory-retained" | "retired";

const rows: ReadonlyArray<{
  family: string;
  status: Status;
  consumer: string;
  evidence: string;
}> = [
  { family: "Actions / Button", status: "production-preserved", consumer: "Cookie consent + library", evidence: "Unchanged implementation; upgraded compatibility/state stories" },
  { family: "Typography / Heading", status: "production-preserved", consumer: "Journal PostCard + library", evidence: "Unchanged implementation; upgraded context/type-role stories" },
  { family: "Forms", status: "modernized", consumer: "Contact extraction + library", evidence: "Field states and Contact parity" },
  { family: "Feedback + display", status: "modernized", consumer: "Library", evidence: "State, contrast and keyboard stories" },
  { family: "Layout primitives", status: "structural", consumer: "Library / composition", evidence: "Existing API documented with responsive stories" },
  { family: "Artist shell", status: "production-preserved", consumer: "Live pages", evidence: "Studio windows, page headers, mark and signal" },
  { family: "Navigation + journal", status: "production-preserved", consumer: "Live site", evidence: "Header, footer, PostCard and share stories" },
  { family: "Privacy + player", status: "production-preserved", consumer: "App shell", evidence: "Consent and persistent-player stories" },
  { family: "Motion / effects", status: "laboratory-retained", consumer: "No direct production consumer", evidence: "Laboratory warning and purpose stories" },
  { family: "Duplicate UI button", status: "retired", consumer: "None", evidence: "Removed after import and barrel-export audit; canonical Button remains" },
  { family: "Legacy reference artifacts", status: "laboratory-retained", consumer: "None", evidence: "Examples/config remnants excluded from supported APIs and Storybook discovery" },
] as const;

function Coverage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>System register / v2</p>
        <h1 className={styles.title}>Coverage is a claim with evidence.</h1>
        <p className={styles.lead}>
          Each retained family has one terminal disposition. “Production” means a
          real site consumer; a Storybook example alone does not qualify.
        </p>
      </header>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Family</th>
              <th scope="col">Disposition</th>
              <th scope="col">Actual consumer</th>
              <th scope="col">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ family, status, consumer, evidence }, index) => (
              <tr key={family}>
                <th scope="row"><span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>{family}</th>
                <td><span className={styles.status} data-status={status}>{status}</span></td>
                <td>{consumer}</td>
                <td>{evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.note}>
        External ownership: Spotify and SoundCloud iframe internals. Safety boundary:
        Storybook never sends live EmailJS messages.
      </p>
    </main>
  );
}

const meta = {
  title: "Production/Coverage",
  component: Coverage,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component: "Release-level component status. The complete file-by-file register lives in docs/design-system/component-inventory.md.",
      },
    },
  },
} satisfies Meta<typeof Coverage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inventory: Story = {};
