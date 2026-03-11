export interface TearBand {
  index: number;
  top: number;      // px from viewport top
  bottom: number;   // px from viewport top
  direction: "left" | "right";
}

/**
 * Compute horizontal band positions for the DOM tear effect.
 * Bands divide the viewport into equal-height slices with
 * alternating slide directions (even: left, odd: right).
 */
export function computeBands(
  viewportHeight: number,
  count = 8
): TearBand[] {
  const bandHeight = viewportHeight / count;
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    top: Math.round(bandHeight * i),
    bottom: Math.round(bandHeight * (i + 1)),
    direction: (i % 2 === 0 ? "left" : "right") as "left" | "right",
  }));
}

/**
 * Apply clip-path bands to a container element and animate them offscreen.
 * Returns a promise that resolves when all bands have exited.
 */
export function tearExit(
  container: HTMLElement,
  options: { duration?: number; stagger?: number; bandCount?: number } = {}
): Promise<void> {
  const { duration = 100, stagger = 15, bandCount = 8 } = options;
  const height = container.offsetHeight;
  const bands = computeBands(height, bandCount);

  const animations: Animation[] = [];

  return new Promise<void>((resolve) => {
    const clone = container.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      overflow: hidden;
    `;

    bands.forEach((band, i) => {
      const strip = clone.cloneNode(true) as HTMLElement;
      const topPct = (band.top / height) * 100;
      const bottomPct = (band.bottom / height) * 100;

      strip.style.cssText = `
        position: absolute;
        inset: 0;
        clip-path: inset(${topPct}% 0 ${100 - bottomPct}% 0);
        will-change: transform;
        pointer-events: none;
      `;

      wrapper.appendChild(strip);

      const speedFactor = 0.7 + Math.abs(i - bandCount / 2) / bandCount * 0.6;
      const xTarget = band.direction === "left" ? "-110%" : "110%";
      const delay = i * stagger;

      const anim = strip.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(${xTarget})` },
        ],
        {
          duration: duration * speedFactor,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
      animations.push(anim);
    });

    container.style.position = "relative";
    const prevVisibility = container.style.visibility;
    container.style.visibility = "hidden";
    container.appendChild(wrapper);

    const lastAnim = animations[animations.length - 1];
    if (lastAnim) {
      lastAnim.onfinish = () => {
        wrapper.remove();
        container.style.visibility = prevVisibility;
        resolve();
      };
    } else {
      container.style.visibility = prevVisibility;
      resolve();
    }
  });
}

/**
 * Assemble animation — new page content slides in from alternating directions.
 * Mirror of tearExit but in reverse: bands slide IN to final position.
 */
export function tearEnter(
  container: HTMLElement,
  options: { duration?: number; stagger?: number; bandCount?: number } = {}
): Promise<void> {
  const { duration = 140, stagger = 20, bandCount = 8 } = options;
  const height = container.offsetHeight;
  const bands = computeBands(height, bandCount);

  return new Promise<void>((resolve) => {
    const clone = container.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      overflow: hidden;
    `;

    const animations: Animation[] = [];

    bands.forEach((band, i) => {
      const strip = clone.cloneNode(true) as HTMLElement;
      const topPct = (band.top / height) * 100;
      const bottomPct = (band.bottom / height) * 100;

      strip.style.cssText = `
        position: absolute;
        inset: 0;
        clip-path: inset(${topPct}% 0 ${100 - bottomPct}% 0);
        will-change: transform;
        pointer-events: none;
      `;

      wrapper.appendChild(strip);

      const speedFactor = 0.7 + Math.abs(i - bandCount / 2) / bandCount * 0.6;
      const xStart = band.direction === "left" ? "-110%" : "110%";
      const delay = i * stagger;

      const anim = strip.animate(
        [
          { transform: `translateX(${xStart})` },
          { transform: "translateX(0)" },
        ],
        {
          duration: duration * speedFactor,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
      animations.push(anim);
    });

    container.style.position = "relative";
    const prevVisibility = container.style.visibility;
    container.style.visibility = "hidden";
    container.appendChild(wrapper);

    const lastAnim = animations[animations.length - 1];
    if (lastAnim) {
      lastAnim.onfinish = () => {
        wrapper.remove();
        container.style.visibility = prevVisibility;
        resolve();
      };
    } else {
      container.style.visibility = prevVisibility;
      resolve();
    }
  });
}
