# Random Gorsey Website

This repository contains the source code for [randomgorsey.com](https://randomgorsey.com), a small React + TypeScript site. The project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses a couple of extra tools for linting and deploying to GitHub Pages.

## Requirements

- Node.js 18 or newer
- npm (comes with Node) to manage packages

## Getting Started

Install the dependencies and start a local development server:

```bash
npm install
npm start
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
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id  
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_PRIVATE_KEY=your_private_key
   ```

**Note**: The `.env` file is ignored by git to keep your credentials secure. Never commit sensitive credentials to version control.

## Useful Scripts

- **`npm test`** – run unit tests using React Testing Library.
- **`npm run lint`** – format and lint the CSS files with stylelint.
- **`npm run storybook`** – launch the component Storybook on port 6006.
- **`npm run build-storybook`** – generate the static Storybook site.
- **`npm run build`** – create an optimized production build and pre-render each route using `react-snap`.
- **`npm run generate-meta`** – update `public/sitemap.xml`, `llms.txt` and `llms-full.txt` based on the current routes.
- SEO metadata for each page is managed through the `PageMeta` component in `src/components`.

## Deployment

Deployment is handled through GitHub Pages. Two commands are available:

```bash
npm run predeploy   # build the site and copy CNAME for GitHub Pages
npm run deploy      # publishes the build folder to the gh-pages branch
```

After a successful deploy, the site will be served from the `gh-pages` branch using the domain specified in `CNAME`.

## Further Reading

For more details on how Create React App works under the hood, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). If you are new to React itself, the [React documentation](https://reactjs.org/) is a great starting point.
