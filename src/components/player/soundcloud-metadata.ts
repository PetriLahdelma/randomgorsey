const SOUNDCLOUD_WIDGET_API_URL = "https://w.soundcloud.com/player/api.js";
const SCRIPT_MARKER = "rgSoundcloudWidgetApi";

export interface SoundCloudPlaybackMetadata {
  title: string;
  artist: string;
  isPlaying: boolean;
}

type MetadataListener = (metadata: SoundCloudPlaybackMetadata) => void;

interface SoundCloudSound {
  title?: unknown;
  user?: { username?: unknown } | null;
  publisher_metadata?: { artist?: unknown } | null;
}

interface SoundCloudWidget {
  bind(event: string, listener: () => void): void;
  unbind(event: string): void;
  getCurrentSound(callback: (sound: SoundCloudSound | null) => void): void;
}

interface SoundCloudWidgetFactory {
  (iframe: HTMLIFrameElement): SoundCloudWidget;
  Events: {
    READY: string;
    PLAY: string;
    PAUSE: string;
    FINISH: string;
  };
}

interface SoundCloudApi {
  Widget: SoundCloudWidgetFactory;
}

interface WidgetSession {
  listeners: Set<MetadataListener>;
  dispose: () => void;
}

declare global {
  interface Window {
    SC?: SoundCloudApi;
  }
}

let soundCloudApiPromise: Promise<SoundCloudApi> | null = null;
const widgetSessions = new WeakMap<HTMLIFrameElement, WidgetSession>();

function currentApi(): SoundCloudApi | null {
  return typeof window !== "undefined" && typeof window.SC?.Widget === "function"
    ? window.SC
    : null;
}

function loadSoundCloudApi(): Promise<SoundCloudApi> {
  const available = currentApi();
  if (available) return Promise.resolve(available);
  if (soundCloudApiPromise) return soundCloudApiPromise;

  soundCloudApiPromise = new Promise<SoundCloudApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-${SCRIPT_MARKER.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="true"]`
    );
    const script = existing ?? document.createElement("script");

    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
    const handleLoad = () => {
      const api = currentApi();
      cleanup();
      if (api) resolve(api);
      else {
        script.remove();
        reject(new Error("SoundCloud Widget API loaded without exposing SC.Widget"));
      }
    };
    const handleError = () => {
      cleanup();
      script.remove();
      reject(new Error("SoundCloud Widget API failed to load"));
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    if (!existing) {
      script.src = SOUNDCLOUD_WIDGET_API_URL;
      script.async = true;
      script.dataset[SCRIPT_MARKER] = "true";
      document.head.appendChild(script);
    }
  }).catch((error) => {
    soundCloudApiPromise = null;
    throw error;
  });

  return soundCloudApiPromise;
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized || null;
}

function normalizeSound(
  sound: SoundCloudSound | null,
  isPlaying: boolean
): SoundCloudPlaybackMetadata | null {
  const title = text(sound?.title);
  const artist = text(sound?.user?.username) ?? text(sound?.publisher_metadata?.artist);
  return title && artist ? { title, artist, isPlaying } : null;
}

function createSession(
  iframe: HTMLIFrameElement,
  api: SoundCloudApi,
  listeners: Set<MetadataListener>
): WidgetSession {
  const widget = api.Widget(iframe);
  const events = api.Widget.Events;
  let active = true;
  let latestRequest = 0;

  const publishCurrent = (isPlaying: boolean) => {
    const request = ++latestRequest;
    widget.getCurrentSound((sound) => {
      if (!active || request !== latestRequest) return;
      const metadata = normalizeSound(sound, isPlaying);
      if (!metadata) return;
      listeners.forEach((listener) => listener(metadata));
    });
  };

  const handlers = new Map<string, () => void>([
    [events.READY, () => publishCurrent(false)],
    [events.PLAY, () => publishCurrent(true)],
    [events.PAUSE, () => publishCurrent(false)],
    [events.FINISH, () => publishCurrent(false)],
  ]);
  handlers.forEach((handler, event) => widget.bind(event, handler));

  return {
    listeners,
    dispose: () => {
      if (!active) return;
      active = false;
      handlers.forEach((_handler, event) => widget.unbind(event));
    },
  };
}

/**
 * Attach current-track reporting to an already selected SoundCloud iframe.
 * Loading is lazy: the provider script is not requested until this is called.
 */
export function attachSoundCloudMetadata(
  iframe: HTMLIFrameElement,
  listener: MetadataListener
): () => void {
  let cancelled = false;
  let session = widgetSessions.get(iframe);

  if (session) session.listeners.add(listener);
  else {
    const listeners = new Set<MetadataListener>([listener]);
    loadSoundCloudApi()
      .then((api) => {
        if (cancelled || !iframe.isConnected) return;
        const current = widgetSessions.get(iframe);
        if (current) {
          current.listeners.add(listener);
          session = current;
          return;
        }
        session = createSession(iframe, api, listeners);
        widgetSessions.set(iframe, session);
      })
      .catch(() => {
        // The provider iframe remains usable when metadata enhancement is unavailable.
      });
  }

  return () => {
    if (cancelled) return;
    cancelled = true;
    const current = session ?? widgetSessions.get(iframe);
    if (!current) return;
    current.listeners.delete(listener);
    if (current.listeners.size > 0) return;
    current.dispose();
    widgetSessions.delete(iframe);
  };
}
