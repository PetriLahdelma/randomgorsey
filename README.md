# Random Gorsey Website

This repository contains the source code for [randomgorsey.com](https://randomgorsey.com). The site now runs on Next.js 16 with the App Router, Tailwind CSS 4, and a shadcn-compatible component setup. The old Vite SPA code has been migrated into `src/site` and is now routed through `src/app`.

## Requirements

- Node.js 22
- npm (comes with Node) to manage packages

## Getting Started

Install the dependencies and start a local development server:

```bash
npm install
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000). Any saved changes will hot reload in the browser.

### Environment Setup

For the contact form to work, you need to configure EmailJS environment variables:

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in your EmailJS credentials in `.env`:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
   NEXT_PUBLIC_SITE_ORIGIN=https://randomgorsey.com
   EMAILJS_PRIVATE_KEY=your_private_key
   ```

**Note**: The `.env` file is ignored by git to keep your credentials secure. Never commit sensitive credentials to version control.

## Useful Scripts

- **`npm test`** – run unit tests using React Testing Library.
- **`npm run lint`** – lint the runtime source used by the Next.js app.
- **`npm run lint:css`** – lint and automatically fix CSS files with stylelint.
- **`npx --no-install stylelint "src/**/*.css"`** – run the nonmutating CSS gate used by CI.
- **`npm run storybook`** – launch the component Storybook on port 6006.
- **`npm run build-storybook`** – generate the static Storybook site.
- **`npx --no-install tsc --project tsconfig.stories.json`** – type-check Storybook configuration, the studio stories, and their imported component contracts.
- **`npm run test:browser`** – run the production-build browser regression suite through Playwright CLI.
- **`node scripts/storybook-check.mjs`** – test the static Storybook build for serious accessibility problems and core interactions. Build Storybook into `.omx/ci/storybook` first.
- **`npm run build`** – create an optimized Next.js production build.
- **`npm run generate-meta`** – update `public/sitemap.xml`, `llms.txt` and `llms-full.txt` based on the current routes.

SEO metadata is now defined at the App Router route layer in `src/app`.

## Versions and changelog

The header reads the version from `package.json`. Record notable changes in the [changelog](CHANGELOG.md) under `Unreleased`; for each release, update the package and lockfile versions together, move those notes under the released version and date, and tag the deployed commit.

## Deployment

Deployment is handled through the existing Vercel Git integration. Use preview deployments for browser and content verification before promoting a production build.

Recommended Vercel setup:

- Import the repository into Vercel.
- Set the production environment variables from `.env.example`.
- Preserve the existing `randomgorsey.com` project and domain configuration.
- Treat `docs/VERCEL_CUTOVER.md` as historical migration context. Verify live project settings before making any domain or DNS change.

## Further Reading

For more details on the current stack, see the [Next.js documentation](https://nextjs.org/docs) and the [shadcn/ui documentation](https://ui.shadcn.com/docs).

## Artist assets and motion

The original vector mark is exported from the native Illustrator working document; see [logo provenance](docs/design-system/logo-provenance.md). The two web variants preserve all twelve glyph paths and contain no bitmap. LisaTerminal is used unmodified at18px for selected window titlebars; its source/license files are retained under src/fonts and public/fonts.

Artwork follows system reduced-motion/data-saving preferences automatically. There is no global Effects switch. Each gallery image has its own Windows-style window. The portrait loop autoplays muted with pause/resume; reduced-motion starts with a still and permits explicit playback. Its delivery renditions retain the full original loop; source files remain intact.
