# Design
## Source of truth
Active — 5 November 2026. Implements the artist workstation direction described in PRODUCT.md. Visitor mode: Experience on Home/Gallery/Listen; Read for posts; Operate for Contact.
## Brand and goals
A private after-hours music workstation. Reserved, authored, precise, alive on deliberate interaction. A real record and an immediate listening action establish identity. No marketing manifesto, fake status logs, generic SaaS cards or performative mystery.
## Users and jobs
Listeners find the music; readers explore the archive; promoters/collaborators reach the existing inquiry form. Audience labels are working assumptions, not new artist facts.
## Information architecture
Keep /, /listen/, /discography/, /gallery/, /about/, /contact/, /posts/[id]/ and404. Header navigation and footer platform links remain conventional and accessible.
## Visual language
Graphite stage (#101210); system gray (#d8d9d2), ivory (#f0f0e6), ink (#11140f); acid yellow-green (#d7ff44) as the signature artwork surface; deep electric blue (#234bdf) for active window chrome; selective cool pink/violet within the artist's media. Sharp borders, 2px bevels, no rounded-card system. Flat Windows3.1 window chrome with legible larger modern controls. The dominant hero is an authored asymmetric music/artwork composition, never a wall of nested windows.
Type: Europa for readable body/editorial; LisaTerminal Paper2X3Y (unmodified supplied WOFF) for navigation, window title bars, and the Listen, Discography, Journal, About, Gallery and Contact titles, with GeistPixelSquare fallback. Use discrete pixel-font sizes for sharp rendering. GeistPixelSquare serves smaller catalog/time/artist-mark roles. Use Tschick only for limited artist display if it serves the new composition. No forced uppercase on long editorial headings. Body16–18px; system12–14px; confident artist display72–140px desktop with controlled wrapping. Text lives separately from transformed artwork.
Layout: full-width page compositions and footer align with the header gutter (30px desktop, 18px at 800px and below, 12px at 360px and below); journal prose keeps a narrow reading measure. Desktop can offset one window; mobile stacks in normal flow.
## Components and ownership
Root implements src/components/studio/StudioWindow.tsx and StudioWindow.module.css with props {title:string,children:ReactNode,className?:string,tone?:'paper'|'dark'|'blue',actions?:ReactNode}. Named export StudioWindow.
Root shared src/styles/studio.css defines studioPage, studioPageHeader, studioKicker, studioTitle, studioLead, studioLink, studioButton, studioText, studioMeta, studioEmpty, studioPlatformLinks, studioSection. Pages may add local CSSModules for actual compositions. Existing primitives remain available.
Root owns AppShell/Header/Footer/PixelLogo/globals and Home. Route implementers own only assigned screens/features. Domain data and client interaction are separate; no global runtime until actual shared need.
## Accessibility and states
Native links/buttons, visible focus, h1perroute, skiplink, labels and live-status errors, dialogs with focus return. No whole-card button wrapping controls. Preserve zoom/reflow; touch44px primary targets. All motion follows system reduced-motion and data-saving preferences. No global Effects on/off feature is exposed. No autoplay audio; embeds loaded by clear action; external links remain when blocked. Decorative assets stay poster-only until policy allows fetching.
## Motion
Distinct related artworks, native scroll, no global cursor/favicons/shell tearing. Home keeps its calm form; Listen uses a faster projected wireframe waveform. Reduced motion stops automatic decorative work. Page content appears immediately, route focus handled without a blocking transition.
## Responsive
390×844,320pxreflow,768tablet,1366×768laptop,1440desktop. No scaled desktop simulation. Titlebars remain readable; primary listening firstview; Contact in nav.
## Content voice
Sparse literal labels: Listen, Play, Pause, Discography, Journal, About, Gallery, Contact. No genius/visionary/cult artist claims, made-up secrecy, availability or response-time guarantees. Keep exact editorial content.
## Implementation constraints
Next16React19TypeScript; CSSModule-owned components, shared CSS tokens, existing Tailwind where useful. No production deps added. No original media deletion. Run lint/types/tests/build/Storybook/CSS and PlaywrightCLI functional+visual checks. CoreP6a real provider listening, optionalP6b only when files exist.
## Open questions
No blockers for core. Owned music files and final optional typeface remain asset-dependent.


## Surface direction contract
THESIS: A solitary artist's work, encountered through a private audiovisual workstation.
OWN-WORLD: Windows3.1 gray/blue bevels and compact actual controls meet acid-colored authored mathematical artwork, real release images, and readable editorial space.
STORY: Identity and one listening action → selected recording → preserved journal; direct music/gallery/about/contact routes remain ordinary useful documents.
FIRST VIEWPORT: Short artist mark, clear Listen control, a substantial generative artwork, and factual selected-recording window. Mobile retains identity/listening before an ordinary stacked composition.
FORM: ReusableStudioWindow + tokenizedCSS; separate live text and art; automatic preference-aware artwork, native scroll, explicitloadplayers, quiet/static fully useful. No liveaudioanalysiswithoutsource.

## Latest direct user refinements
Remove the Music/Images/Words navigation caption and matching frontpage label. Remove the global Effects on/off feature. Listen uses a distinct, more energetic 3D-mesh waveform in the same mathematical visual language as the home artwork. Gallery thumbnails each have their own compact Windows3.1 window. Portrait loop autoplays muted by default with a real pause/resume control; reduced-motion defaults calm and can be explicitly played. These direct instructions supersede earlier opt-in/toggle and portrait poster-only assumptions.

Logo placement refinement: the original native vector mark is the hero identity. Header uses a simple readable text identity, without the ornate mark.

External platform links use a12px label-to-arrow gap consistently. Spotify outer embed corners are squared by a minimal host-side clip; provider-controlled internal controls retain their native shapes. No decorative four-square icon appears in the header. About/Gallery/Contact use solid graphite backgrounds.
