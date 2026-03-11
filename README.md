# Random Gorsey Website

This repository contains the source code for [randomgorsey.com](https://randomgorsey.com). The site now runs on Next.js 16 with the App Router, Tailwind CSS 4, and a shadcn-compatible component setup. The old Vite SPA code has been migrated into `src/site` and is now routed through `src/app`.

## Requirements

- Node.js 18 or newer
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
- **`npm run lint:css`** – lint the CSS files with stylelint.
- **`npm run storybook`** – launch the component Storybook on port 6006.
- **`npm run build-storybook`** – generate the static Storybook site.
- **`npm run build`** – create an optimized Next.js production build.
- **`npm run generate-meta`** – update `public/sitemap.xml`, `llms.txt` and `llms-full.txt` based on the current routes.

SEO metadata is now defined at the App Router route layer in `src/app`.

## Deployment

Deployment should be handled through Vercel Git integration or the Vercel CLI:

```bash
vercel
```

Recommended Vercel setup:

- Import the repository into Vercel.
- Set the production environment variables from `.env.example`.
- Add `randomgorsey.com` and `www.randomgorsey.com` as domains in the Vercel project.
- Update DNS away from GitHub Pages once the Vercel deployment is verified.
- Use the cutover checklist in `docs/VERCEL_CUTOVER.md` for the DNS switch.

## Further Reading

For more details on the current stack, see the [Next.js documentation](https://nextjs.org/docs) and the [shadcn/ui documentation](https://ui.shadcn.com/docs).
