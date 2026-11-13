/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this file as a function expression. */
async (page) => {
  const origin = new URL(page.url()).origin;
  const assertions = [];
  const auditedPlaygrounds = [];
  const auditedControlStories = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const check = (condition, label) => {
    if (!condition) throw new Error(label);
    assertions.push(label);
  };

  const openStory = async (id) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + "/?path=/story/" + id, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await page.locator("iframe").waitFor({ state: "visible", timeout: 10_000 });
    let controlsTab = page.getByRole("tab", { name: /^Controls/ });
    if (await controlsTab.count() === 0) {
      const showPanel = page.getByRole("button", { name: "Show addon panel" });
      await showPanel.waitFor({ state: "visible", timeout: 10_000 });
      await showPanel.click();
      controlsTab = page.getByRole("tab", { name: /^Controls/ });
    }
    try {
      await controlsTab.waitFor({ state: "visible", timeout: 10_000 });
    } catch {
      throw new Error(id + " has no visible Controls panel");
    }
    await controlsTab.click();
    await page.waitForFunction(() => {
      const frame = document.querySelector("iframe");
      return Boolean(frame?.contentDocument?.body);
    });
  };

  const preview = () => page.locator("iframe").contentFrame();

  const row = (name) => page.getByRole("row").filter({
    has: page.getByRole("cell", { name, exact: true }),
  });

  const textControl = (name) => row(name).getByRole("textbox");
  const selectControl = (name) => row(name).getByRole("combobox", { name });
  const booleanControl = (name) => row(name).getByRole("switch", { name });

  const enableBoolean = async (name) => {
    await row(name).getByText("True", { exact: true }).click();
    await page.waitForFunction(
      (controlName) => document.querySelector(`input[role="switch"][name="${controlName}"]`)?.checked === true,
      name,
    );
  };

  const disableBoolean = async (name) => {
    await row(name).getByText("False", { exact: true }).click();
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (!(await booleanControl(name).isChecked())) return;
      await page.waitForTimeout(50);
    }
    throw new Error(name + " did not switch to false");
  };

  const waitForBoolean = async (name, expected, label) => {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await booleanControl(name).isChecked() === expected) return;
      await page.waitForTimeout(50);
    }
    throw new Error(label);
  };

  const waitForControlValue = async (control, expected, label) => {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (await control.inputValue() === expected) return;
      await page.waitForTimeout(50);
    }
    throw new Error(label);
  };

  const checkInitializedBooleans = async (names) => {
    for (const name of names) {
      const control = booleanControl(name);
      check(await control.count() === 1, name + " has an initialized boolean control");
    }
    check(
      await page.getByRole("button", { name: "Set boolean" }).count() === 0,
      "Playground exposes no unset Set boolean controls",
    );
  };

  await openStory("components-button--playground");
  await checkInitializedBooleans([
    "disabled",
    "fullWidth",
    "loading",
  ]);

  const button = preview().getByRole("button", { name: "Accept all" });
  check(await button.isVisible(), "Button Playground renders its initialized label");

  await selectControl("variant").selectOption("danger");
  await page.waitForTimeout(50);
  check(
    (await button.getAttribute("class"))?.includes("bg-destructive"),
    "Changing Button variant updates the preview",
  );

  const initialButtonWidth = await button.evaluate((element) => element.getBoundingClientRect().width);
  await enableBoolean("fullWidth");
  await page.waitForTimeout(50);
  const fullButtonWidth = await button.evaluate((element) => element.getBoundingClientRect().width);
  check(
    fullButtonWidth > initialButtonWidth * 2,
    "Changing Button fullWidth updates preview geometry",
  );

  await enableBoolean("loading");
  await page.waitForTimeout(50);
  check(await button.isDisabled(), "Changing Button loading disables the preview control");

  await page.getByRole("button", { name: "Reset controls" }).click();
  await page.waitForTimeout(500);
  check(
    await selectControl("variant").inputValue() === "primary" &&
      !(await booleanControl("fullWidth").isChecked()) &&
      !(await booleanControl("loading").isChecked()),
    "Reset restores Button controls to explicit defaults",
  );

  await openStory("components-forms-input--playground");
  await checkInitializedBooleans(["disabled", "required", "loading", "autoFocus"]);

  const inputLabel = textControl("label");
  await inputLabel.fill("Archive code");
  await page.waitForTimeout(50);
  const input = preview().getByLabel("Archive code");
  check(await input.isVisible(), "Changing Input label updates the preview association");

  await input.fill("RG-INTERACTIVE-09");
  await waitForControlValue(
    textControl("value"),
    "RG-INTERACTIVE-09",
    "Input preview did not synchronize its value control",
  );
  check(
    await textControl("value").inputValue() === "RG-INTERACTIVE-09",
    "Typing in Input preview synchronizes its value control",
  );

  await enableBoolean("disabled");
  await page.waitForTimeout(50);
  check(await input.isDisabled(), "Changing Input disabled updates the preview control");

  await page.getByRole("button", { name: "Reset controls" }).click();
  await page.waitForTimeout(500);
  check(
    await textControl("label").inputValue() === "Project reference" &&
      !(await booleanControl("disabled").isChecked()),
    "Reset restores Input controls to explicit defaults",
  );

  await openStory("components-forms-select--playground");
  await checkInitializedBooleans(["disabled", "required", "multiple", "loading"]);

  await textControl("label").fill("Contact route");
  await page.waitForTimeout(50);
  const select = preview().getByLabel("Contact route");
  check(await select.isVisible(), "Changing Select label updates the preview association");

  await select.selectOption("collaboration");
  const selectValueControl = row("value").getByRole("textbox", { name: "Edit value as JSON" });
  await waitForControlValue(
    selectValueControl,
    '"collaboration"',
    "Select preview did not synchronize its value control",
  );
  check(
    await selectValueControl.inputValue() === '"collaboration"',
    "Changing Select preview synchronizes its value control",
  );

  await enableBoolean("disabled");
  await page.waitForTimeout(50);
  check(await select.isDisabled(), "Changing Select disabled updates the preview control");

  await openStory("components-forms-checkbox--playground");
  await page.getByRole("button", { name: "Reset controls" }).click();
  await waitForBoolean(
    "checked",
    false,
    "Checkbox reset did not restore the explicit false default",
  );
  const checkbox = preview().getByRole("checkbox", { name: /Retain a local copy/ });
  await checkbox.click();
  await waitForBoolean(
    "checked",
    true,
    "Checkbox preview did not synchronize its checked control",
  );
  check(await checkbox.isChecked(), "Checkbox preview keeps its controlled checked state");

  await openStory("components-forms-textarea--playground");
  const textarea = preview().getByLabel("Message");
  await textarea.fill("Control synchronization stays visible.");
  await waitForControlValue(
    textControl("value"),
    "Control synchronization stays visible.",
    "TextArea preview did not synchronize its value control",
  );
  check(
    await textControl("value").inputValue() === "Control synchronization stays visible.",
    "Changing TextArea preview synchronizes its value control",
  );

  await openStory("library-feedback-modal--playground");
  check(
    await preview().getByRole("dialog", { name: "Confirm source change" }).isVisible(),
    "Modal Playground honors the initialized open control",
  );
  await disableBoolean("isOpen");
  await preview().getByRole("dialog").waitFor({ state: "detached" });
  check(
    await preview().getByRole("dialog").count() === 0,
    "Changing Modal isOpen closes the preview dialog",
  );
  await preview().getByRole("button", { name: "Open dialog" }).click();
  await waitForBoolean(
    "isOpen",
    true,
    "Modal preview trigger did not synchronize isOpen",
  );
  await preview().getByRole("button", { name: "Close modal" }).click();
  await waitForBoolean(
    "isOpen",
    false,
    "Modal dismiss did not synchronize isOpen",
  );
  await preview().getByRole("dialog").waitFor({ state: "detached" });
  check(
    await preview().getByRole("dialog").count() === 0,
    "Modal dismissal updates both preview and manager control",
  );

  await openStory("library-display-badge--playground");
  const badgeText = textControl("text");
  await badgeText.fill("Ready to publish");
  const badge = preview().getByText("Ready to publish", { exact: true });
  await badge.waitFor({ state: "visible" });
  await selectControl("variant").selectOption("success");
  check(await badge.isVisible(), "Changing Badge text updates the preview");
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if ((await badge.getAttribute("class"))?.includes("badgeSuccess")) break;
    await page.waitForTimeout(50);
  }
  check(
    (await badge.getAttribute("class"))?.includes("badgeSuccess"),
    "Changing Badge variant updates the preview treatment",
  );

  const storyIndex = await page.evaluate(async () => {
    const response = await fetch("/index.json");
    if (!response.ok) throw new Error("Unable to load Storybook index");
    return response.json();
  });
  const expectedPlaygrounds = [
    "components-button--playground",
    "components-forms-checkbox--playground",
    "components-forms-field--playground",
    "components-forms-input--playground",
    "components-forms-select--playground",
    "components-forms-textarea--playground",
    "components-heading--playground",
    "components-socialshare--default",
    "effects-motion-lab--interactive",
    "foundations-original-artist-mark--ink",
    "laboratory-effects-heroimage--default",
    "laboratory-effects-particlefield--default",
    "laboratory-effects-scene3d--default",
    "laboratory-effects-videobackground--default",
    "library-display-avatar--playground",
    "library-display-badge--playground",
    "library-feedback-alert--playground",
    "library-feedback-modal--playground",
    "library-feedback-spinner--playground",
    "library-layout-bleed--default",
    "library-layout-cluster--default",
    "library-layout-container--default",
    "library-layout-grid--default",
    "library-layout-stack--default",
    "library-legacy-kinetictext--characters",
    "library-legacy-revealonscroll--default",
    "library-surfaces-surface--playground",
    "library-typography-caption--playground",
    "library-typography-text--playground",
    "production-journal-postcard--latest-entry",
    "production-navigation-header--desktop",
    "studio-page-header--listen",
    "studio-window--playground",
  ];
  const playgroundIds = Object.values(storyIndex.entries)
    .filter((entry) => entry.type === "story" && entry.name === "Playground")
    .map((entry) => entry.id)
    .sort();
  check(
    JSON.stringify(playgroundIds) === JSON.stringify(expectedPlaygrounds),
    "Storybook index exposes the complete expected Playground inventory",
  );

  const controlStoryIds = [
    ...playgroundIds,
    "components-forms-grouplabel--fieldset-legend",
    "components-forms-label--default",
  ].sort();

  for (const id of controlStoryIds) {
    await openStory(id);
    const panel = page.getByRole("tabpanel", { name: /^Controls/ });
    const controlRows = panel.getByRole("row");
    await controlRows.nth(1).waitFor({ state: "visible", timeout: 5_000 });
    check(
      await controlRows.count() > 1,
      id + " exposes at least one real control",
    );
    check(
      await panel.getByRole("button", { name: /^Set / }).count() === 0,
      id + " exposes no unset Set-value placeholders",
    );
    auditedControlStories.push(id);
    if (playgroundIds.includes(id)) auditedPlaygrounds.push(id);
  }

  return {
    assertionCount: assertions.length,
    assertions,
    auditedPlaygroundCount: auditedPlaygrounds.length,
    auditedPlaygrounds,
    auditedControlStoryCount: auditedControlStories.length,
    auditedControlStories,
    consoleErrors,
  };
}
