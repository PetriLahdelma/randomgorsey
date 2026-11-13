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
    "production-compositions-release--catalog-surface",
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
      (await page.getByRole("link", { name: "So Long Spectrum on Bandcamp" }).getAttribute("href")) ||
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

  await openStory("foundations-system--color-and-layers", 1200, 900);
  check(
    await page.getByText("--component-surface-canvas", { exact: true }).isVisible(),
    "Foundation color story derives its surface roles from generated tokens",
  );
  check(
    await page.getByText("#101210", { exact: true }).isVisible() &&
      await page.getByText("#d7ff44", { exact: true }).isVisible(),
    "Foundation color story resolves canvas and signal values from CSS custom properties",
  );

  await openStory("foundations-system--spacing-and-density", 390, 844);
  check(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "Foundation spacing scale reflows without horizontal overflow",
  );
  check(
    await page.locator("code").evaluateAll((codes) => codes.filter((code) => code.textContent?.trim()).length === 6) &&
      await page.getByText("4px", { exact: true }).isVisible() &&
      await page.getByText("32px", { exact: true }).isVisible(),
    "Foundation spacing story exposes six token names with resolved endpoint values",
  );

  await openStory("foundations-system--focus-and-motion", 768, 800);
  const foundationFocusTarget = page.getByRole("button", { name: "Keyboard target" }).first();
  await foundationFocusTarget.focus();
  check(
    await foundationFocusTarget.evaluate((target) => {
      const style = getComputedStyle(target);
      return style.outlineWidth === "3px" && style.outlineColor === "rgb(35, 75, 223)";
    }),
    "Foundation focus story resolves the generated 3px blue focus treatment on paper",
  );

  await openStory("components-forms-input--invalid");
  const invalidInput = page.getByLabel("Project reference");
  const inputDescription = await invalidInput.getAttribute("aria-describedby");
  check(
    await invalidInput.getAttribute("aria-invalid") === "true" &&
      Boolean(inputDescription) &&
      await page.locator("#" + inputDescription).getByText("Enter the complete project reference.", { exact: true }).isVisible(),
    "Input invalid state associates its control with the visible error",
  );

  await openStory("components-forms-select--invalid");
  const invalidSelect = page.getByLabel("Inquiry type");
  check(
    await invalidSelect.getAttribute("aria-invalid") === "true" &&
      await page.getByRole("alert").getByText("Choose an inquiry type.", { exact: true }).isVisible(),
    "Select invalid state preserves native semantics and an associated error",
  );

  await openStory("components-forms-checkbox--invalid");
  const invalidCheckbox = page.getByRole("checkbox", { name: /Retain a local copy/ });
  check(
    await invalidCheckbox.getAttribute("aria-invalid") === "true" &&
      await invalidCheckbox.getAttribute("required") !== null &&
      await page.getByRole("alert").isVisible(),
    "Checkbox invalid state remains native, required and described",
  );

  await openStory("components-forms-textarea--long-content", 390, 844);
  check(
    await page.getByLabel("Message").isVisible() &&
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "TextArea long-content state remains labelled and fits a mobile viewport",
  );

  await openStory("components-forms-label--default");
  check(
    await page.getByLabel("Project reference").isVisible(),
    "Standalone Label default story remains associated with its native input",
  );
  await openStory("components-forms-label--required");
  check(
    await page.getByText("Project reference", { exact: false }).isVisible() &&
      await page.locator("#storybook-root label").first().evaluate((label) => label.textContent?.trim().endsWith("*")),
    "Standalone Label required state exposes a visible required marker",
  );

  await openStory("components-forms-grouplabel--fieldset-legend");
  check(
    await page.getByRole("group", { name: "Delivery preferences" }).isVisible() &&
      await page.getByText("Choose every route that can receive updates.", { exact: true }).isVisible(),
    "GroupLabel story exposes a named and described fieldset",
  );

  await openStory("library-feedback-alert--state-matrix");
  check(
    await page.getByRole("alert").count() === 4,
    "Alert state matrix renders all four semantic status variants",
  );
  await page.getByRole("button", { name: "Close alert" }).click();
  check(
    await page.getByRole("alert").count() === 3,
    "Alert dismiss control removes only the closeable alert",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStory("library-feedback-modal--default");
  await page.getByRole("button", { name: "Open dialog" }).click();
  const reducedModal = page.getByRole("dialog", { name: "Confirm source change" });
  await reducedModal.waitFor();
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Close modal");
  check(
    await reducedModal.evaluate((dialog) => {
      const transform = getComputedStyle(dialog).transform;
      return transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)";
    }) &&
      await page.getByRole("button", { name: "Close modal" }).evaluate((button) => button === document.activeElement),
    "Modal honors reduced motion while retaining focus placement",
  );
  await page.keyboard.press("Escape");
  await reducedModal.waitFor({ state: "detached" });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await openStory("library-feedback-modal--default");
  const modalTrigger = page.getByRole("button", { name: "Open dialog" });
  await modalTrigger.click();
  const modal = page.getByRole("dialog", { name: "Confirm source change" });
  await modal.waitFor();
  await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Close modal");
  check(
    await page.getByRole("button", { name: "Close modal" }).evaluate((button) => button === document.activeElement),
    "Modal moves focus to its first control",
  );
  await page.keyboard.press("Escape");
  await modal.waitFor({ state: "detached" });
  check(
    await modalTrigger.evaluate((button) => button === document.activeElement),
    "Modal Escape exit restores focus to its trigger",
  );

  await openStory("library-surfaces-surface--state-matrix");
  check(
    await page.getByRole("button", { name: "Interactive semantic button surface" }).isVisible(),
    "Surface state matrix preserves polymorphic button semantics",
  );

  for (const [id, width, label] of [
    ["library-layout-bleed--default", 320, "Bleed"],
    ["library-layout-cluster--distribution", 320, "Cluster"],
    ["library-layout-container--size-scale", 320, "Container"],
    ["library-layout-grid--minimum-width", 390, "Grid"],
    ["library-layout-stack--gap-scale", 320, "Stack"],
  ]) {
    await openStory(id, width, 844);
    check(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      label + " structural story has no mobile horizontal overflow",
    );
  }

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
    ["production-surfaces--journal-entry-page", "The List"],
    ["production-surfaces--not-found-page", "Signal Not Found"],
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

  await openStory("production-foundations-motionrules--interactive-contract", 1200, 900);
  check(await page.locator("#motion-rule-list + ol > li").count() === 20, "Motion contract documents all 20 requested rules");
  check(await page.getByText("Conditional", {exact: true}).count() === 4, "Motion contract marks inapplicable interaction types as conditional");
  const motionContract = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      menu: root.getPropertyValue("--motion-duration-menu").trim(),
      exit: root.getPropertyValue("--motion-duration-exit").trim(),
      stagger: root.getPropertyValue("--motion-stagger").trim(),
      easeOut: root.getPropertyValue("--motion-ease-out").trim(),
      easeInOut: root.getPropertyValue("--motion-ease-in-out").trim(),
    };
  });
  check(["200ms", ".2s"].includes(motionContract.menu) && ["160ms", ".16s"].includes(motionContract.exit) && motionContract.stagger === "30ms", "Motion timing tokens resolve to 200ms, 160ms and 30ms");
  check(/\.16|0\.16/.test(motionContract.easeOut) && /\.65|0\.65/.test(motionContract.easeInOut), "Motion easing tokens distinguish entrance from on-screen movement");
  const openMotionMenu = page.getByRole("button", {name: "Open menu"});
  await openMotionMenu.click();
  const motionRows = page.locator('[aria-hidden="false"] > div');
  check(await motionRows.count() === 4, "Motion reference renders four staggered menu rows");
  check(await motionRows.nth(1).evaluate(row => getComputedStyle(row).transitionDelay.includes("0.03")), "Motion reference staggers its second row by 30ms");
  const closeMotionMenu = page.getByRole("button", {name: "Close menu"});
  await closeMotionMenu.hover();
  await page.mouse.down();
  await page.waitForTimeout(120);
  check(await closeMotionMenu.evaluate(button => getComputedStyle(button).scale === "0.97"), "Production button press resolves to scale 0.97");
  await page.mouse.up();

  await openStory("production-foundations-motionrules--handheld-reference", 390, 844);
  const handheldButton = page.getByRole("button", {name: "Open menu"});
  await handheldButton.hover();
  await page.mouse.down();
  await page.waitForTimeout(120);
  check(await handheldButton.evaluate(button => getComputedStyle(button).scale === "1"), "Forced handheld reference has no press scale");
  await page.mouse.up();

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
