import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useState } from "react";

import Button from "@/components/Button";
import { StudioWindow } from "@/components/studio/StudioWindow";

import styles from "./MotionRules.module.css";

type Rule = {
  title: string;
  note: string;
  status: "contract" | "conditional";
};

const rules: Rule[] = [
  { title: "Ease-out for entrances", note: "Routine arrivals use the production ease-out token.", status: "contract" },
  { title: "Dropdowns at 150–250ms", note: "The production target is 200ms in and 160ms out.", status: "contract" },
  { title: "Stagger list rows by 30ms", note: "Rows settle in order with a bounded 30ms delay.", status: "contract" },
  { title: "Scale buttons to 0.97 on press", note: "Fine-pointer press feedback only; handheld input remains immediate.", status: "contract" },
  { title: "Stretch moving knobs 12%", note: "Conditional: no slider, scrubber, or draggable knob exists on the site.", status: "conditional" },
  { title: "Stagger when details settle", note: "Applies to real field and menu groups, not static page sections.", status: "contract" },
  { title: "Use arcs for object movement", note: "Conditional: use when an object genuinely changes spatial ownership.", status: "conditional" },
  { title: "Use a pulse to confirm success", note: "One restrained confirmation pulse; never an idle loop.", status: "contract" },
  { title: "Use ease-in-out for on-screen movement", note: "Movement within an already visible surface uses the in-out token.", status: "contract" },
  { title: "Start popovers at scale 0.95", note: "Share uses a clipped reveal from its trigger. Privacy consent remains immediate for reliable control.", status: "contract" },
  { title: "Transition in from the trigger", note: "Transform origin follows the invoking control, not the viewport center.", status: "contract" },
  { title: "Transition out toward the trigger", note: "Exit reverses toward the same origin in 80% of the entrance time.", status: "contract" },
  { title: "No spring bounce for everyday UI", note: "Routine interface motion uses deterministic tweens.", status: "contract" },
  { title: "Don’t tween animations while using handheld", note: "Coarse-pointer and reduced-motion modes switch state without tweening.", status: "contract" },
  { title: "Make exits 20% shorter than entrances", note: "200ms entrance / 160ms exit is the standard pair.", status: "contract" },
  { title: "Overlap old and new states", note: "Use when content changes in place so the interface never blanks.", status: "contract" },
  { title: "Masks for reveals and colour", note: "Clip-path reveals belong to bounded windows and popovers.", status: "contract" },
  { title: "Crossfade icons with scale and blur", note: "Reserved for meaningful state swaps such as copy confirmation.", status: "contract" },
  { title: "Rubber band past bounds", note: "Conditional: no draggable bounded control currently exists.", status: "conditional" },
  { title: "Reuse the same layout ID across shared objects", note: "Conditional for future duplicated objects; the player already keeps the same iframe node mounted.", status: "conditional" },
];

function MotionRules({ staticMotion = false }: { staticMotion?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moved, setMoved] = useState(false);

  return (
    <main className={`${styles.page} ${staticMotion ? styles.staticMotion : ""}`}>
      <header className={`studioPageHeader ${styles.intro}`}>
        <p className="studioKicker">Production motion contract</p>
        <h1 className="studioTitle">Motion rules</h1>
        <p className="studioLead">Motion explains feedback, state and spatial continuity. Conditional rules stay dormant until the product contains the interaction they describe.</p>
      </header>

      <section className={styles.samples} aria-label="Motion samples">
        <StudioWindow title="MENU / 200MS" tone="paper">
          <div className={styles.dropdownAnchor}>
            <Button
              className={styles.pressTarget}
              variant="secondary-dark"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? "Close menu" : "Open menu"}
            </Button>
            <div
              className={`${styles.dropdown} ${menuOpen ? styles.dropdownOpen : ""}`}
              aria-hidden={!menuOpen}
            >
              {["Listen", "Discography", "Journal", "About"].map((item, index) => (
                <div className={styles.row} key={item} style={{ "--row-index": index } as CSSProperties}>
                  <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </StudioWindow>

        <StudioWindow title="MOVEMENT / IN-OUT" tone="paper">
          <Button
            className={styles.pressTarget}
            variant="secondary-dark"
            onClick={() => setMoved((current) => !current)}
          >
            Move object
          </Button>
          <div className={styles.movementStage}>
            <span className={`${styles.movingObject} ${moved ? styles.movingObjectEnd : ""}`} aria-hidden="true" />
          </div>
        </StudioWindow>
      </section>

      <section aria-labelledby="motion-rule-list">
        <p className="studioKicker">20 production rules</p>
        <h2 id="motion-rule-list" className={styles.referenceTitle}>Applied honestly</h2>
        <ol className={styles.reference}>
          {rules.map((rule, index) => (
            <li className={styles.referenceItem} key={rule.title}>
              <span className={styles.ruleNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className={styles.ruleTitle}>{rule.title}</p>
                <span className={`${styles.status} ${rule.status === "conditional" ? styles.conditional : ""}`}>
                  {rule.status === "conditional" ? "Conditional" : "Contract"}
                </span>
              </div>
              <p className={styles.ruleNote}>{rule.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

const meta = {
  title: "Production/Foundations/MotionRules",
  component: MotionRules,
  args: {
    staticMotion: false,
  },
  argTypes: {
    staticMotion: {
      control: "boolean",
      description: "Stops sample transitions for reduced-motion and handheld review.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  parameters: {
    docs: {
      description: {
        component: "The production motion contract. Interactive samples use actual StudioWindow and Button components; conditional rules are documented without inventing product controls.",
      },
    },
  },
} satisfies Meta<typeof MotionRules>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveContract: Story = {};

export const ReducedMotionReference: Story = {
  args: { staticMotion: true },
  parameters: { docs: { description: { story: "Forced static reference for reduced-motion review." } } },
};

export const HandheldReference: Story = {
  args: { staticMotion: true },
  parameters: {
    viewport: { defaultViewport: "mobile" },
    docs: { description: { story: "Handheld reference with state changes but no tweens." } },
  },
};
