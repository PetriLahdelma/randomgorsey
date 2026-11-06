# Changelog

Notable changes to the Random Gorsey site are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and future versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The package version `0.1.0` was introduced on 2025-05-14 and remained unchanged through subsequent deployments. The dated entries below record verified changes made while that same version was in use; they do not imply separate historical versioned releases.

## [Unreleased]

## [0.4.9] - 2026-11-06

### Changed

- Update the About biography with the artist-approved text.

## [0.4.8] - 2026-11-06

### Changed

- Interlace the Listen artwork and unloaded-player display.

## [0.4.7] - 2026-11-06

### Changed

- Display journal timestamps verbatim in the feed and index, with varied fictional times for the retrospective entries.
- Set the 404 page title in Lisa Terminal Paper.
- Display gallery image labels as underscore-separated `.JPG` names without repeating Helsinki.
- Interlace gallery thumbnails while showing original images in the viewer.

### Fixed

- End journal excerpts at word boundaries.

## [0.4.6] - 2026-11-06

### Changed

- Keep the listening console in place as the page scrolls and reserve its space when the player is minimized or its source changes.
- Widen the listening player and add a scrolling compact label with SoundCloud track details when available.
- Rename the signal artwork to Stable azimuth, add a small animated equalizer label, and remove the misleading generative-artwork caption.
- Halve the About portrait, label it `UNTITLED_09.JPG`, and overlap it slightly with the biography window.
- Stack the Other projects heading above its full-width list and remove the rule above Collected entries.

### Fixed

- Remove excess vertical space around the Spotify embed.

## [0.4.5] - 2026-11-06

### Changed

- Expand page compositions and the footer to align with the full-width header.

## [0.4.4] - 2026-11-06

### Changed

- Use a dark accent for the SoundCloud player controls.

## [0.4.3] - 2026-11-05

### Added

- Publish nine retrospective journal entries dated April–November 2026.

## [0.4.2] - 2026-11-05

### Changed

- Set journal entry titles in Lisa Terminal Paper.

### Removed

- Remove the portrait background from the Journal.

## [0.4.1] - 2026-11-05

### Added

- Add a shared page-header component and Storybook stories for the live interface and Share states.

### Changed

- Give the journal Share menu the studio window treatment and distinguish legacy stories from production UI.
- Add subtle interlacing to the About portrait and match its surrounding window to the biography panel.

## [0.4.0] - 2026-11-05

### Added

- Keep the selected listening player available across pages, with minimize, expand and close controls.
- Add Storybook stories for current site surfaces, navigation, privacy and player states.

### Changed

- Give footer platform links enough room to stay on one row at desktop widths.

## [0.3.2] - 2026-11-05

### Changed

- Rename the new gallery portrait to `UNTITLED_09.JPG`.

## [0.3.1] - 2026-11-05

### Added

- Add the portrait to the gallery and subtly layer it behind the journal.

### Changed

- Replace the About-page portrait loop with the new cropped motion artwork.

## [0.3.0] - 2026-11-05

### Added

- Publish current AI-readable Markdown, a complete sitemap, an API catalog and a read-only journal discovery skill.
- Add factual artist and release structured data and optional read-only WebMCP discovery.
- Add a read-only MCP server for the journal and releases, with discovery cards.
- Add the Grit poster to the gallery.

### Changed

- Express the artist's preference for AI search and summaries while disallowing model training in crawler policy.
- Align the cookie-preferences control with the footer link styling.

### Removed

- Retire stale generated agent files that no longer matched the site's content.

## [0.2.0] - 2026-11-05

### Added

- Display the current package version in the header.
- Establish this changelog for future releases.

## [0.1.0] - 2026-11-05

This is a retrospective snapshot of the production site deployed on this date, not the first release of `0.1.0`. The package had carried that version since its introduction on the main project history in May 2025.

### Added

- 2025-05-14: Initialize the Random Gorsey website and its `0.1.0` package version.
- 2026-11-05: Add reusable studio components and Storybook stories for the redesigned site.
- 2026-11-05: Add the approved social-sharing image and Open Graph metadata.

### Changed

- 2026-11-05: Redesign the artist site around the original logo, recorded music, journal and Windows-inspired visual language.
- 2026-11-05: Present gallery images in individual windows, square release artwork, a responsive listening page and a controllable portrait loop.
- 2026-11-05: Update Next.js and other existing dependencies; make high-severity production dependency audits block CI.

### Fixed

- 2026-11-05: Prevent generative artwork from collapsing when stylesheets load in a different order.
- 2026-11-05: Make the home heading readable to crawlers and align link, track-number and artwork treatments.
- 2026-11-05: Restore the production Google Analytics configuration, with tracking enabled only after consent.

[Unreleased]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.4.2...HEAD
[0.4.2]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.3.2...v0.4.0
[0.3.2]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/PetriLahdelma/randomgorsey/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/PetriLahdelma/randomgorsey/releases/tag/v0.2.0
[0.1.0]: https://github.com/PetriLahdelma/randomgorsey/commit/7e6c8715
