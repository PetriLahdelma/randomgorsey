/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this file as a function expression. */
async (page) => {
  const origin = new URL(page.url()).origin;
  const consoleErrors = [];
  const assertions = [];
  const violations = [];
  let storyCount = 0;

  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const check = (condition, label) => {
    if (!condition) throw new Error(label);
    assertions.push(label);
  };

  // The Storybook accessibility addon can still be auditing the story when
  // this separate check begins. Retry only that transient overlap.
  const runAxe = async (selector = null) => page.evaluate(async (target) => {
    const element = target ? document.querySelector(target) : document.body;
    if (!element) throw new Error("Accessibility target not found: " + target);
    for (let attempt = 0; attempt < 40; attempt += 1) {
      try {
        return await window.axe.run(element, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
        });
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes("Axe is already running") || attempt === 39) throw error;
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
    throw new Error("Accessibility audit did not complete");
  }, selector);

  const openStory = async (id, width = 1200, height = 900) => {
    storyCount += 1;
    await page.setViewportSize({ width, height });
    await page.goto(
      origin + "/iframe.html?id=" + id + "&viewMode=story",
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(
      () => !document.fonts || document.fonts.status === "loaded",
    );
    await page.addScriptTag({ url: origin + "/__axe.js" });
    const result = await runAxe();
    for (const violation of result.violations) {
      if (violation.impact === "serious" || violation.impact === "critical") {
        violations.push({
          story: id,
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          targets: violation.nodes.map((node) => node.target),
        });
      }
    }
  };

  await openStory("studio-window--paper");
  check(
    await page.getByText("So Long Spectrum", { exact: true }).isVisible(),
    "Paper window renders factual catalog content",
  );

  await openStory("studio-window--long-title-and-actions", 390, 844);
  check(
    await page.getByRole("button", { name: "Open", exact: true }).isVisible(),
    "Long-title mobile window retains its action",
  );
  check(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "Long-title mobile window has no horizontal overflow",
  );

  await openStory(
    "studio-compositions-release--catalog-surface",
    390,
    844,
  );
  check(
    await page
      .getByRole("img", { name: "So Long Spectrum cover artwork" })
      .isVisible(),
    "Release composition renders real catalog artwork",
  );
  check(
    /randomgorsey\.bandcamp\.com/.test(
      (await page.getByRole("link", { name: "Bandcamp" }).getAttribute("href")) ||
        "",
    ),
    "Release composition preserves the Bandcamp destination",
  );
  check(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "Release composition reflows without horizontal overflow",
  );
  const windowStyles = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const windowElement = document.querySelector('[data-tone="paper"]');
    const body = windowElement?.children[1];
    if (!windowElement || !body) return null;
    const windowStyle = getComputedStyle(windowElement);
    const bodyStyle = getComputedStyle(body);
    return {
      stage: root.getPropertyValue("--studio-stage").trim(),
      paper: root.getPropertyValue("--studio-paper").trim(),
      blue: root.getPropertyValue("--studio-blue").trim(),
      foreground: bodyStyle.color,
      background: windowStyle.backgroundColor,
    };
  });
  check(
    windowStyles?.stage === "#101210" &&
      windowStyles.paper === "#d8d9d2" &&
      windowStyles.blue === "#234bdf",
    "Studio design tokens resolve to their contracted values",
  );
  check(
    windowStyles?.foreground === "rgb(17, 20, 15)" &&
      windowStyles.background === "rgb(216, 217, 210)",
    "Paper window resolves its ink foreground and system-gray background: " +
      JSON.stringify(windowStyles),
  );

  await openStory("foundations-typography--minimum-reflow", 320, 720);
  check(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    "Typography specimen reflows at 320 CSS pixels",
  );
  check(
    await page.getByText("Work before claims.", { exact: true }).isVisible(),
    "Typography specimen preserves the work-led heading",
  );
  const typographyStyles = await page.evaluate(() => {
    const heading = document.querySelector(".studioTitle");
    const system = document.querySelector(".studioMeta");
    if (!heading || !system) return null;
    const headingStyle = getComputedStyle(heading);
    const systemStyle = getComputedStyle(system);
    return {
      headingFamily: headingStyle.fontFamily.toLowerCase(),
      headingColor: headingStyle.color,
      systemFamily: systemStyle.fontFamily.toLowerCase(),
      systemColor: systemStyle.color,
    };
  });
  check(
    typographyStyles?.headingFamily.includes("lisaterminal") &&
      typographyStyles.headingColor === "rgb(240, 240, 230)",
    "Display type resolves to LisaTerminal with the ivory foreground token",
  );
  check(
    Boolean(
      typographyStyles &&
        typographyStyles.systemFamily !== typographyStyles.headingFamily &&
        /geist|courier|monospace/.test(typographyStyles.systemFamily) &&
        typographyStyles.systemColor !== "rgba(0, 0, 0, 0)",
    ),
    "System type resolves independently with a visible foreground",
  );

  await openStory("effects-motion-lab--interactive", 768, 800);
  const motionButton = page.getByRole("button", {
    name: /Pause artwork|Resume artwork/,
  });
  check(await motionButton.isVisible(), "Motion Lab exposes a real control");
  const before = await motionButton.getAttribute("aria-pressed");
  await motionButton.click();
  await page.waitForFunction(
    (previous) =>
      document
        .querySelector('button[aria-pressed]')
        ?.getAttribute("aria-pressed") !== previous,
    before,
  );
  check(
    (await motionButton.getAttribute("aria-pressed")) !== before,
    "Motion Lab control changes the artwork state",
  );

  for (const [id, heading] of [
    ["production-surfaces--home-and-journal", "Random Gorsey"],
    ["production-surfaces--listen-console", "Listen"],
    ["production-surfaces--discography-page", "Discography"],
    ["production-surfaces--about-page", "About"],
    ["production-surfaces--gallery-page", "Gallery"],
    ["production-surfaces--contact-page", "Get in touch"],
  ]) {
    await openStory(id);
    check(await page.getByRole("heading", {name: heading, exact: true}).isVisible(), id + " renders its real page heading");
    if (id === "production-surfaces--listen-console") {
      check(await page.locator("iframe").count() === 0, "Listen story does not load providers without a click");
    }
    if (id === "production-surfaces--gallery-page") {
      check(await page.getByText("UNTITLED_09.JPG", {exact: true}).isVisible(), "Gallery story uses the current portrait title");
    }
  }

  await openStory("production-player-sitewideplayer--interactive-lifecycle", 390, 844);
  check(await page.getByRole("button", {name: "Load Spotify player"}).isVisible(), "Player story exposes its real source controls");
  check(await page.locator("iframe").count() === 0, "Player story starts without loading a third-party frame");
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Player story reflows on mobile");

  await openStory("production-surfaces--home-loads-more");
  await page.waitForFunction(() => document.querySelectorAll("article").length === 12);
  check(await page.getByRole("article").count() === 12, "Home story loads the next real journal entries");

  let contactRequests = 0;
  await page.route("**/api.emailjs.com/**", route => { contactRequests += 1; return route.abort(); });
  await openStory("production-surfaces--contact-submission-blocked");
  await page.getByText("Submission intercepted. No message was sent from Storybook.").waitFor();
  check(contactRequests === 0, "Contact story blocks real message delivery");

  await openStory("studio-page-header--listen", 390, 844);
  check(await page.getByRole("heading", {name: "Listen", exact: true}).isVisible(), "Shared page-header story renders the real Listen heading");
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Shared page header fits mobile");

  await openStory("components-socialshare--open-menu", 980, 280);
  const shareMenu = page.getByRole("menu", {name: "Share Light Returning"});
  await shareMenu.waitFor();
  check(await shareMenu.getByRole("menuitem", {name: "Share on Telegram"}).isVisible(), "Share story exposes its full real menu");
  check(await shareMenu.evaluate(menu => {const rect=menu.getBoundingClientRect();return rect.top>=0&&rect.bottom<=innerHeight;}), "Share menu fits a short viewport");
  const shareAudit = await runAxe('[role="menu"]');
  for (const violation of shareAudit.violations) {
    if (violation.impact === "serious" || violation.impact === "critical") violations.push({story:"components-socialshare--open-menu",id:violation.id,impact:violation.impact,help:violation.help,targets:violation.nodes.map(node=>node.target)});
  }

  await openStory("components-socialshare--keyboard-navigation");
  await page.getByRole("button", {name:"Share"}).waitFor();
  check(await page.getByRole("button", {name:"Share"}).getAttribute("aria-expanded") === "false", "Share keyboard story closes the menu");

  await openStory("components-socialshare--paper-surface");
  check(await page.getByRole("button", {name:"Share"}).isVisible(), "Share uses the real light journal window context");
  await page.getByRole("button", {name:"Share"}).hover();
  check(await page.getByRole("button", {name:"Share"}).evaluate(button=>getComputedStyle(button).color)==="rgb(17, 20, 15)", "Share remains legible on paper while hovered");

  await openStory("production-surfaces--gallery-viewer-open", 390, 844);
  await page.getByRole("dialog", {name:"Image viewer"}).waitFor();
  check(await page.getByRole("button", {name:"Close image"}).isVisible(), "Gallery viewer story exposes its real close control");

  await openStory("production-surfaces--about-portrait-paused", 390, 844);
  await page.getByRole("button", {name:"Play portrait loop"}).waitFor();
  check(await page.getByRole("button", {name:"Play portrait loop"}).isVisible(), "About portrait story shows the paused control");

  return {
    storyCount,
    assertionCount: assertions.length,
    assertions,
    consoleErrors,
    violations,
  };
}
