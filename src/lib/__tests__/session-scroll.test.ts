import { describe, it, expect, beforeEach } from "vitest";
import { saveHomeScroll, loadHomeScroll, type HomeScrollState } from "../session-scroll";

describe("session-scroll", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saves and loads scroll state", () => {
    const state: HomeScrollState = { scrollY: 450, expandedPosts: [3, 7, 12] };
    saveHomeScroll(state);
    const loaded = loadHomeScroll();
    expect(loaded).toEqual(state);
  });

  it("returns null when no state saved", () => {
    expect(loadHomeScroll()).toBeNull();
  });

  it("returns null when version mismatches", () => {
    sessionStorage.setItem("rg:home:scroll", JSON.stringify({ scrollY: 100, expandedPosts: [], version: -1 }));
    expect(loadHomeScroll()).toBeNull();
  });

  it("clears stored state", () => {
    saveHomeScroll({ scrollY: 100, expandedPosts: [] });
    expect(loadHomeScroll()).not.toBeNull();
    sessionStorage.removeItem("rg:home:scroll");
    expect(loadHomeScroll()).toBeNull();
  });
});
