import {
  durations,
  eases,
  stagger,
  transitions,
} from "./config";
import {
  modalVariants,
  overlayVariants,
  pageVariants,
  staggerContainer,
  staggerItem,
} from "./variants";
import { aboutCardItem, galleryStaggerContainer } from "./section-variants";
import { postCardChild, postCardStagger, postCardVariants } from "./scroll-variants";

type VariantState = Record<string, unknown> & {
  transition?: Record<string, unknown>;
};

const state = (
  variants: Record<string, unknown>,
  key: string,
): VariantState => variants[key] as VariantState;

describe("production motion contract", () => {
  it("uses a 200ms entrance and a 20% shorter exit", () => {
    expect(durations.enter).toBe(0.2);
    expect(durations.dropdown).toBeGreaterThanOrEqual(0.15);
    expect(durations.dropdown).toBeLessThanOrEqual(0.25);
    expect(durations.exit).toBeCloseTo(durations.enter * 0.8);
    expect(transitions.enter).toMatchObject({ type: "tween", duration: 0.2 });
    expect(transitions.exit).toMatchObject({ type: "tween", duration: 0.16 });
  });

  it("keeps entrance and on-screen movement easings semantically distinct", () => {
    expect(eases.out).toEqual([0.16, 1, 0.3, 1]);
    expect(eases.inOut).toEqual([0.65, 0, 0.35, 1]);
    expect(eases.inOut).not.toEqual(eases.out);
    expect(transitions.movement.ease).toBe(eases.inOut);
  });

  it("settles list rows 30ms apart with shorter reverse exits", () => {
    expect(stagger.rows).toBe(0.03);
    expect(stagger.rowsExit).toBe(0.024);
    expect(state(staggerContainer, "enter").transition?.staggerChildren).toBe(0.03);
    expect(state(staggerContainer, "exit").transition?.staggerChildren).toBe(0.024);
    expect(state(postCardStagger, "visible").transition?.staggerChildren).toBe(0.03);
    expect(state(galleryStaggerContainer, "enter").transition?.staggerChildren).toBe(0.03);
  });

  it("uses non-bouncing tweens for routine page, modal, list and card motion", () => {
    const routineTransitions = [
      state(pageVariants, "enter").transition,
      state(pageVariants, "exit").transition,
      state(overlayVariants, "enter").transition,
      state(overlayVariants, "exit").transition,
      state(modalVariants, "enter").transition,
      state(modalVariants, "exit").transition,
      state(staggerItem, "enter").transition,
      state(staggerItem, "exit").transition,
      state(aboutCardItem, "enter").transition,
      state(aboutCardItem, "exit").transition,
      state(postCardVariants, "visible").transition,
      state(postCardChild, "visible").transition,
    ];

    expect(routineTransitions).not.toContain(undefined);
    routineTransitions.forEach((transition) => {
      expect(transition?.type).toBe("tween");
      expect(transition).not.toHaveProperty("stiffness");
      expect(transition).not.toHaveProperty("damping");
    });
  });
});
