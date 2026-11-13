# Component inventory

This register records what the repository actually ships. A Storybook story is evidence, not proof of production use.

Terminal dispositions:

- `modernized`: retained reusable library component using the Industrial Design System V2 foundation.
- `production-preserved`: consumed by the live site; its appearance and behaviour are regression invariants.
- `structural`: retained layout/composition utility whose implementation is unchanged; stories document its existing contract without claiming modernization.
- `laboratory-retained`: experimental utility with explicit ownership and no production-readiness claim.
- `retired`: superseded artifact with no supported role.

## Reusable components

| Source | Disposition | Actual consumer | Story / evidence |
| --- | --- | --- | --- |
| `Alert.tsx` | modernized | library only; uses a native dismiss button | `Library/Feedback/Alert` |
| `Avatar.tsx` | modernized | library only | `Library/Display/Avatar` |
| `Badge.tsx` | modernized | library only | `Library/Display/Badge` |
| `Caption.tsx` | modernized | library only | `Library/Typography/Caption` |
| `Checkbox.tsx` | modernized | library only | `Components/Forms/Checkbox` |
| `GroupLabel.tsx` | modernized | grouped-field library primitive | `Components/Forms/GroupLabel` |
| `Input.tsx` | modernized | form library / Contact foundation | `Components/Forms/Input` |
| `Label.tsx` | modernized | `Input`, `Select`, form foundation | `Components/Forms/Label`; composed control states |
| `Modal.tsx` | modernized | library only | `Library/Feedback/Modal` |
| `Select.tsx` | modernized | form library / Contact foundation | `Components/Forms/Select` |
| `Spinner.tsx` | modernized | library only | `Library/Feedback/Spinner` |
| `Surface.tsx` | modernized | library only | `Library/Surfaces/Surface` |
| `Text.tsx` | modernized | library only | `Library/Typography/Text` |
| `TextArea.tsx` | modernized | form library / Contact foundation | form state coverage |
| `forms/Field.tsx` | modernized | Contact page and form foundation | Contact parity; composed field state stories |
| `layout/Bleed.tsx` | structural | `HeroImage` composition | `Library/Layout/Bleed` |
| `layout/Cluster.tsx` | structural | library only | `Library/Layout/Cluster` |
| `layout/Container.tsx` | structural | `Bleed`, `Grid`, `HeroImage` composition | `Library/Layout/Container` |
| `layout/Grid.tsx` | structural | library only | `Library/Layout/Grid` |
| `layout/Stack.tsx` | structural | library only | `Library/Layout/Stack` |

### Contact presentation parity exceptions

`forms/FormField.module.css` contains one reusable system presentation and one explicitly scoped `[data-presentation="contact"]` presentation. The Contact presentation preserves the pre-extraction live page exactly and is not counted as generic-control migration debt.

- 11 raw color expressions preserve the established label, field, bevel, focus and error values.
- 14 raw spacing/size expressions preserve Contact label rhythm, input padding, bevel widths, minimum heights, focus offset and error spacing.
- These exceptions apply only to `.field[data-presentation="contact"]`, `.contactControl` and `.contactTextarea`; the default system presentation consumes generated `--ds-*` and `--component-*` tokens.
- Removing or tokenizing these values requires a separate Contact parity comparison at the pinned viewports before it can be described as behavior-preserving.

## Production-preserved components

| Source | Actual consumer | Story / evidence |
| --- | --- | --- |
| `AgentTools.tsx` | `AppShell`; read-only journal tool registration | production app-shell tests |
| `AppShell.tsx` | root layout | live browser parity |
| `CookieConsent.tsx` | `AppShell` | `Production/Privacy/CookiePreferences` |
| `CookiePreferencesButton.tsx` | footer | privacy production story and browser parity |
| `Button.tsx` | `CookieConsent` | unchanged implementation; upgraded `Components/Button` states and consent parity |
| `DeferredPostBody.tsx` | `PostCard` | journal production story |
| `Lightbox.tsx` | `PostCard` | journal production story |
| `Heading.tsx` | `PostCard` | unchanged implementation; upgraded `Components/Heading` context stories |
| `PostCard.tsx` | Home and journal-entry pages | `Production/Journal/PostCard` |
| `SocialShare.tsx` | `PostCard` | `Components/SocialShare` keyboard/copy states |
| `PixelLogo.tsx` | site header | `Production/Navigation/Header` |
| `player/PersistentPlayer.tsx` | `AppShell`, Listen page | `Production/Player/SitewidePlayer` |
| `studio/BrandMark.tsx` | Home and footer | `Foundations/Original Artist Mark` |
| `studio/SignalArtwork.tsx` | Home and Listen | production surfaces and artwork stories |
| `studio/SignalLabel.tsx` | Home and Listen | `Production/Artwork/SignalLabel` |
| `studio/StudioPageHeader.tsx` | Listen, Discography, About, Gallery | `Studio/Page Header` |
| `studio/StudioWindow.tsx` | all major content pages and 404 | `Studio/Window` |

## Laboratory-retained components

These utilities are not part of the production component contract. Their ownership and intended use are documented in `Laboratory/Registry`; direct render stories remain under `Laboratory/Effects` where safe.

| Source | Purpose | Direct production consumer |
| --- | --- | --- |
| `AnimatedHeading.tsx` | experimental character-reveal heading | none |
| `GlitchLink.tsx` | experimental distorted link treatment | none |
| `KineticText.tsx` | split-text motion experiment | none |
| `RevealOnScroll.tsx` | viewport reveal experiment | none |
| `effects/AmbientLayer.tsx` | reactive ambient visual layer | none |
| `effects/CursorTrail.tsx` | pointer-trail experiment | none |
| `effects/HeroImage.tsx` | full-bleed media experiment | none |
| `effects/NoiseShimmer.tsx` | loading/degradation texture | none |
| `effects/ParticleField.tsx` | WebGL particle experiment | none |
| `effects/ScanLineReveal.tsx` | scan-line reveal experiment | none |
| `effects/Scene3D.tsx` | Three.js scene wrapper | none |
| `effects/VideoBackground.tsx` | full-bleed video experiment | none |

## Retired artifacts

| Source | Disposition | Rationale |
| --- | --- | --- |
| `components/ui/button.tsx` | retired | removed after confirming zero imports, zero barrel exports and no unique role; canonical `components/Button.tsx` owns the supported button API |

## Legacy retained / non-production artifacts

These files remain in the repository, so they are not classified as retired. They are retained as non-production references and excluded from supported Storybook/component APIs.

| Source | Disposition | Rationale |
| --- | --- | --- |
| `components/Select.examples.tsx` | laboratory-retained | historical example reference; supported usage lives in Storybook state stories |
| `stories/Configure.mdx.old` | laboratory-retained | setup remnant excluded from Storybook discovery by its `.old` suffix |

## Story inventory

| Story source | Disposition | System role |
| --- | --- | --- |
| `stories/production/Coverage.stories.tsx` | production-preserved | release coverage register |
| `stories/production/InterfaceLanguage.stories.tsx` | production-preserved | live interface language |
| `stories/production/MotionRules.stories.tsx` | production-preserved | motion contract and conditional rules |
| `stories/production/ProductionSurfaces.stories.tsx` | production-preserved | live surface composition |
| `stories/production/AboutPortraitEffects.stories.tsx` | production-preserved | portrait media treatment demo |
| `stories/production/CookieConsent.stories.tsx` | production-preserved | privacy controls |
| `stories/production/Player.stories.tsx` | production-preserved | persistent player lifecycle |
| `stories/Header.stories.tsx`, `stories/Footer.stories.tsx` | production-preserved | live navigation |
| `stories/PostCard.stories.tsx`, `components/SocialShare.stories.tsx` | production-preserved | journal and sharing |
| `stories/studio/BrandMark.stories.tsx` | production-preserved | original artist mark |
| `stories/studio/ReleaseWindow.stories.tsx` | production-preserved | release composition |
| `stories/studio/StudioPageHeader.stories.tsx` | production-preserved | shared page header |
| `stories/studio/StudioWindow.stories.tsx` | production-preserved | artist-shell window |
| `stories/studio/Typography.stories.tsx` | production-preserved | expressive artist typography |
| `components/studio/SignalLabel.stories.tsx` | production-preserved | motion artwork label |
| `stories/foundations/System.stories.tsx` | modernized | generated colors, layers, type, density, focus and motion |
| `stories/Button.stories.tsx`, `stories/Heading.stories.tsx` | production-preserved | upgraded state/context evidence for unchanged live-consumed components |
| `stories/Alert.stories.tsx`, `stories/Avatar.stories.tsx`, `stories/Badge.stories.tsx`, `stories/Modal.stories.tsx`, `stories/Surface.stories.tsx`, `stories/Text.stories.tsx`, `stories/Caption.stories.tsx`, `stories/Spinner.stories.tsx` | modernized | feedback, display, dialog and typography states |
| `stories/Input.stories.tsx`, `stories/Select.stories.tsx`, `stories/Checkbox.stories.tsx`, `stories/TextArea.stories.tsx`, `components/Label.stories.tsx`, `components/GroupLabel.stories.tsx` | modernized | form state, labels and grouped-field semantics |
| `stories/layout/Bleed.stories.tsx`, `Cluster.stories.tsx`, `Container.stories.tsx`, `Grid.stories.tsx`, `Stack.stories.tsx` | structural | existing responsive layout contracts; implementations unchanged |
| `stories/laboratory/Registry.stories.tsx` | laboratory-retained | ownership and purpose register |
| `stories/effects/HeroImage.stories.tsx`, `ParticleField.stories.tsx`, `Scene3D.stories.tsx`, `VideoBackground.stories.tsx` | laboratory-retained | direct experimental renders |
| `stories/cursor/CustomCursor.stories.tsx` | laboratory-retained | pointer experiment |
| `stories/RevealOnScroll.stories.tsx` | laboratory-retained | viewport reveal experiment |
| `stories/studio/MotionLab.stories.tsx` | laboratory-retained | artist-shell motion experiment |
| `stories/KineticText.stories.tsx` | laboratory-retained | split-text motion experiment with no current page consumer |

## Ownership boundaries

- Generated `--ds-*` and `--component-*` values describe the component library.
- Existing `--studio-*` values continue to own the live artist shell.
- Provider iframe controls are external and are not simulated as native components.
- Storybook never performs live EmailJS delivery.
