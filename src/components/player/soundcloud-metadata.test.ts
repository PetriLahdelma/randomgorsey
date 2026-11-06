interface MockWidget {
  bind: ReturnType<typeof vi.fn>;
  unbind: ReturnType<typeof vi.fn>;
  getCurrentSound: ReturnType<typeof vi.fn>;
  handlers: Map<string, () => void>;
  sound: unknown;
}

const EVENTS = {
  READY: "ready",
  PLAY: "play",
  PAUSE: "pause",
  FINISH: "finish",
};

async function setup() {
  vi.resetModules();
  delete window.SC;
  document.head.querySelectorAll("script[data-rg-soundcloud-widget-api]").forEach((script) => script.remove());
  const metadataModule = await import("./soundcloud-metadata");
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  return { ...metadataModule, iframe };
}

function installMockApi() {
  const widgets = new Map<HTMLIFrameElement, MockWidget>();
  const Widget = vi.fn((iframe: HTMLIFrameElement) => {
    const handlers = new Map<string, () => void>();
    const widget: MockWidget = {
      handlers,
      sound: { title: "Night Bus", user: { username: "Random Gorsey" } },
      bind: vi.fn((event: string, handler: () => void) => handlers.set(event, handler)),
      unbind: vi.fn((event: string) => handlers.delete(event)),
      getCurrentSound: vi.fn((callback: (sound: unknown) => void) => callback(widget.sound)),
    };
    widgets.set(iframe, widget);
    return widget;
  });
  Object.assign(Widget, { Events: EVENTS });
  window.SC = { Widget } as typeof window.SC;
  return { Widget, widgets };
}

describe("attachSoundCloudMetadata", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.querySelectorAll("script[data-rg-soundcloud-widget-api]").forEach((script) => script.remove());
    delete window.SC;
  });

  it("loads the official API lazily and reports real play state metadata", async () => {
    const { attachSoundCloudMetadata, iframe } = await setup();
    expect(document.querySelector("script[data-rg-soundcloud-widget-api]")).toBeNull();

    const listener = vi.fn();
    const detach = attachSoundCloudMetadata(iframe, listener);
    const script = document.querySelector<HTMLScriptElement>("script[data-rg-soundcloud-widget-api]");
    expect(script).toHaveAttribute("src", "https://w.soundcloud.com/player/api.js");
    const { widgets } = installMockApi();
    script?.dispatchEvent(new Event("load"));
    await vi.waitFor(() => expect(widgets.has(iframe)).toBe(true));

    const widget = widgets.get(iframe)!;
    widget.handlers.get(EVENTS.READY)?.();
    expect(listener).toHaveBeenLastCalledWith({
      title: "Night Bus",
      artist: "Random Gorsey",
      isPlaying: false,
    });
    widget.handlers.get(EVENTS.PLAY)?.();
    expect(listener).toHaveBeenLastCalledWith({
      title: "Night Bus",
      artist: "Random Gorsey",
      isPlaying: true,
    });
    widget.handlers.get(EVENTS.PAUSE)?.();
    expect(listener).toHaveBeenLastCalledWith({
      title: "Night Bus",
      artist: "Random Gorsey",
      isPlaying: false,
    });

    detach();
    expect(widget.unbind).toHaveBeenCalledTimes(4);
  });

  it("shares one widget session across listeners and disposes after the last detach", async () => {
    const { attachSoundCloudMetadata, iframe } = await setup();
    const { Widget, widgets } = installMockApi();
    const first = vi.fn();
    const second = vi.fn();
    const detachFirst = attachSoundCloudMetadata(iframe, first);
    const detachSecond = attachSoundCloudMetadata(iframe, second);
    await vi.waitFor(() => expect(widgets.has(iframe)).toBe(true));

    const widget = widgets.get(iframe)!;
    widget.handlers.get(EVENTS.PLAY)?.();
    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
    expect(Widget).toHaveBeenCalledOnce();

    detachFirst();
    expect(widget.unbind).not.toHaveBeenCalled();
    widget.handlers.get(EVENTS.PAUSE)?.();
    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledTimes(2);
    detachSecond();
    expect(widget.unbind).toHaveBeenCalledTimes(4);
  });

  it("ignores invalid sounds and callbacks that arrive after cleanup", async () => {
    const { attachSoundCloudMetadata, iframe } = await setup();
    const { widgets } = installMockApi();
    const listener = vi.fn();
    const detach = attachSoundCloudMetadata(iframe, listener);
    await vi.waitFor(() => expect(widgets.has(iframe)).toBe(true));
    const widget = widgets.get(iframe)!;

    widget.sound = { title: "", user: { username: "Random Gorsey" } };
    widget.handlers.get(EVENTS.PLAY)?.();
    expect(listener).not.toHaveBeenCalled();

    let delayed: ((sound: unknown) => void) | undefined;
    widget.getCurrentSound.mockImplementation((callback: (sound: unknown) => void) => {
      delayed = callback;
    });
    widget.handlers.get(EVENTS.PLAY)?.();
    detach();
    delayed?.({ title: "Late result", user: { username: "Ignored" } });
    expect(listener).not.toHaveBeenCalled();
  });

  it("ignores an older metadata response after playback state changes", async () => {
    const { attachSoundCloudMetadata, iframe } = await setup();
    const { widgets } = installMockApi();
    const listener = vi.fn();
    const detach = attachSoundCloudMetadata(iframe, listener);
    await vi.waitFor(() => expect(widgets.has(iframe)).toBe(true));
    const widget = widgets.get(iframe)!;
    const callbacks: Array<(sound: unknown) => void> = [];
    widget.getCurrentSound.mockImplementation((callback: (sound: unknown) => void) => callbacks.push(callback));
    widget.handlers.get(EVENTS.PLAY)?.();
    widget.handlers.get(EVENTS.PAUSE)?.();
    const sound = { title: "Night Bus", user: { username: "Random Gorsey" } };
    callbacks[1](sound);
    callbacks[0](sound);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenLastCalledWith({ title: "Night Bus", artist: "Random Gorsey", isPlaying: false });
    detach();
  });

  it("can retry after the provider API script fails", async () => {
    const { attachSoundCloudMetadata, iframe } = await setup();
    const detachFirst = attachSoundCloudMetadata(iframe, vi.fn());
    const first = document.querySelector<HTMLScriptElement>("script[data-rg-soundcloud-widget-api]")!;
    first.dispatchEvent(new Event("error"));
    await vi.waitFor(() => expect(first.isConnected).toBe(false));
    detachFirst();
    const listener = vi.fn();
    const detach = attachSoundCloudMetadata(iframe, listener);
    const second = document.querySelector<HTMLScriptElement>("script[data-rg-soundcloud-widget-api]")!;
    expect(second).not.toBe(first);
    const { widgets } = installMockApi();
    second.dispatchEvent(new Event("load"));
    await vi.waitFor(() => expect(widgets.has(iframe)).toBe(true));
    widgets.get(iframe)!.handlers.get(EVENTS.PLAY)?.();
    expect(listener).toHaveBeenCalledOnce();
    detach();
  });

  it("does not create a widget if detached before the API finishes loading", async () => {
    const { attachSoundCloudMetadata, iframe } = await setup();
    const listener = vi.fn();
    const detach = attachSoundCloudMetadata(iframe, listener);
    const script = document.querySelector<HTMLScriptElement>("script[data-rg-soundcloud-widget-api]")!;
    detach();
    const { Widget } = installMockApi();
    script.dispatchEvent(new Event("load"));
    await Promise.resolve();
    expect(Widget).not.toHaveBeenCalled();
    expect(listener).not.toHaveBeenCalled();
  });
});
