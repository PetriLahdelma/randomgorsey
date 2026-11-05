import React from "react";
import { act, render } from "@testing-library/react";

import AgentTools, { createJournalIndexTool } from "./AgentTools";

describe("AgentTools", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (document as Document & { modelContext?: unknown }).modelContext;
  });

  it("does nothing when WebMCP is unavailable", () => {
    expect(() => render(<AgentTools />)).not.toThrow();
  });

  it("registers one read-only bounded tool and unregisters it on cleanup", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: { registerTool },
    });

    const view = render(<AgentTools />);
    await act(async () => Promise.resolve());

    expect(registerTool).toHaveBeenCalledOnce();
    const [tool, options] = registerTool.mock.calls[0];
    expect(tool.name).toBe("list_random_gorsey_journal");
    expect(tool.annotations).toEqual({
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    });
    expect(tool.inputSchema.properties.limit.maximum).toBe(12);
    expect(options.signal.aborted).toBe(false);

    view.unmount();
    expect(options.signal.aborted).toBe(true);
  });

  it("cleans up the superseded registration during StrictMode remounting", async () => {
    const registerTool = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: { registerTool },
    });

    const view = render(
      <React.StrictMode>
        <AgentTools />
      </React.StrictMode>
    );
    await act(async () => Promise.resolve());

    expect(registerTool).toHaveBeenCalledTimes(2);
    expect(registerTool.mock.calls[0][1].signal.aborted).toBe(true);
    expect(registerTool.mock.calls[1][1].signal.aborted).toBe(false);

    view.unmount();
    expect(registerTool.mock.calls[1][1].signal.aborted).toBe(true);
  });

  it("executes against the real public API contract and returns bounded metadata", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          totalPosts: 56,
          posts: [
            {
              id: 56,
              title: "A post",
              timestamp: "2026-03-22T12:00",
              category: "studio",
              excerpt: "Source-backed journal text.",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const lifetime = new AbortController();
    const execution = new AbortController();
    const lifetimeRemove = vi.spyOn(lifetime.signal, "removeEventListener");
    const executionRemove = vi.spyOn(execution.signal, "removeEventListener");

    const result = await createJournalIndexTool(lifetime.signal).execute(
      { offset: 12, limit: 1 },
      { signal: execution.signal }
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/posts/?offset=12&limit=1",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(result).toEqual({
      offset: 12,
      limit: 1,
      totalPosts: 56,
      nextOffset: 13,
      posts: [
        {
          id: 56,
          title: "A post",
          published: "2026-03-22T12:00",
          category: "studio",
          excerpt: "Source-backed journal text.",
          url: "https://randomgorsey.com/posts/56/",
        },
      ],
    });
    expect(lifetimeRemove).toHaveBeenCalledWith("abort", expect.any(Function));
    expect(executionRemove).toHaveBeenCalledWith("abort", expect.any(Function));
  });

  it("disposes abort listeners when the journal request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const lifetime = new AbortController();
    const execution = new AbortController();
    const lifetimeRemove = vi.spyOn(lifetime.signal, "removeEventListener");
    const executionRemove = vi.spyOn(execution.signal, "removeEventListener");

    await expect(
      createJournalIndexTool(lifetime.signal).execute({}, {
        signal: execution.signal,
      })
    ).rejects.toThrow("offline");

    expect(lifetimeRemove).toHaveBeenCalledWith("abort", expect.any(Function));
    expect(executionRemove).toHaveBeenCalledWith("abort", expect.any(Function));
  });

  it.each([
    [{ offset: -1 }, "offset"],
    [{ offset: 0.5 }, "offset"],
    [{ limit: 0 }, "limit"],
    [{ limit: 13 }, "limit"],
  ])("rejects invalid input %o", async (input, field) => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const controller = new AbortController();

    await expect(
      createJournalIndexTool(controller.signal).execute(input, {
        signal: controller.signal,
      })
    ).rejects.toThrow(field);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
