/**
 * Canvas-rendered favicon that cycles through pixel font variants every 4 seconds.
 * Pauses when the tab is hidden.
 */

const FONTS = [
  '"Geist Pixel Square", monospace',
  '"Geist Pixel Grid", monospace',
  '"Geist Pixel Circle", monospace',
];

const CYCLE_INTERVAL = 4000;
const CANVAS_SIZE = 32;

function renderFavicon(font: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Text
  ctx.fillStyle = "#f2e059";
  ctx.font = `bold 14px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RG", CANVAS_SIZE / 2, CANVAS_SIZE / 2);

  return canvas.toDataURL("image/png");
}

function getFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }
  return link;
}

/**
 * Starts cycling the favicon through pixel font variants.
 * Returns a cleanup function that stops cycling.
 */
export function startFaviconCycle(): () => void {
  if (typeof window === "undefined") return () => {};

  let currentIndex = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const link = getFaviconLink();

  function applyFont(index: number) {
    const dataUrl = renderFavicon(FONTS[index]);
    if (dataUrl) {
      link.href = dataUrl;
    }
  }

  function start() {
    applyFont(currentIndex);
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % FONTS.length;
      applyFont(currentIndex);
    }, CYCLE_INTERVAL);
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  start();

  return () => {
    stop();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
