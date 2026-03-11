import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeBands, type TearBand } from "../DOMTear";

describe("computeBands", () => {
  it("divides viewport into specified number of bands", () => {
    const bands = computeBands(800, 8);
    expect(bands).toHaveLength(8);
  });

  it("bands cover entire viewport height without gaps", () => {
    const bands = computeBands(1000, 10);
    expect(bands[0].top).toBe(0);
    expect(bands[bands.length - 1].bottom).toBe(1000);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].top).toBe(bands[i - 1].bottom);
    }
  });

  it("alternates direction (odd left, even right)", () => {
    const bands = computeBands(800, 8);
    bands.forEach((band, i) => {
      expect(band.direction).toBe(i % 2 === 0 ? "left" : "right");
    });
  });

  it("uses default 8 bands when count not specified", () => {
    const bands = computeBands(800);
    expect(bands).toHaveLength(8);
  });
});
