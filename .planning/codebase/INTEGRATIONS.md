# External Integrations

**Analysis Date:** 2026-01-17

## APIs & External Services

**Email:**
- EmailJS - Client-side contact form email sending
  - SDK/Client: `@emailjs/browser` 4.4.1
  - Auth: Environment variables
    - `REACT_APP_EMAILJS_SERVICE_ID`
    - `REACT_APP_EMAILJS_TEMPLATE_ID`
    - `REACT_APP_EMAILJS_PUBLIC_KEY`
  - Implementation: `src/pages/Contact.tsx`
  - Features: Rate limiting (5 attempts/minute), input sanitization, honeypot spam protection

**Analytics:**
- Ahrefs Analytics
  - Script: `https://analytics.ahrefs.com/analytics.js`
  - Data key: `DMOWx2XL40vTWGkiohEkrQ`
  - Location: `public/index.html` (async script tag)

**Search/SEO:**
- Google Search Console
  - Verification: `pC4Zl0-9Z2GoscmvHFsdbyWxMRtImo2CDnZ5ht0G9Vs`
  - Location: meta tag in `public/index.html`

## Embedded Content

**Music Streaming (iframe embeds):**
- Spotify
  - Artist embed: `https://open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q`
  - Playlist embed (in posts): `https://open.spotify.com/embed/playlist/2UuOSxusqGSoi35dIstgiA`
  - Location: `src/pages/Listen.tsx`, `src/posts/RandomRecommends.tsx`

- SoundCloud
  - Widget player: `https://w.soundcloud.com/player/`
  - Playlist ID: 2029288998
  - Location: `src/pages/Listen.tsx`

**Social Links (external navigation):**
- Spotify: `https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q`
- SoundCloud: `https://soundcloud.com/randomgorsey`
- Instagram: `https://www.instagram.com/random_gorsey`
- YouTube: `https://www.youtube.com/@randomgorsey8125`
- Bandcamp: `https://randomgorsey.bandcamp.com`
- Location: `src/patterns/Footer.tsx`

## Data Storage

**Databases:**
- None - Static site with no database

**File Storage:**
- Local filesystem only
- Static assets in `public/images/`
- Video assets in `src/videos/` (WebM format)

**Caching:**
- Browser caching only (static assets)

## Authentication & Identity

**Auth Provider:**
- None - No user authentication required
- Contact form uses client-side validation only

## Monitoring & Observability

**Error Tracking:**
- None - No dedicated error tracking service

**Logs:**
- Browser console only
- Development: HTTPS status logging via `src/utils/httpsEnforcement.ts`
- Error logging: console.error for EmailJS failures

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
- Custom domain: https://randomgorsey.com
- CNAME file generated during build

**CI Pipeline:**
- Not detected in repository
- Manual deployment via `npm run deploy` (gh-pages)

**Build Process:**
1. `npm run predeploy` - Runs build + copies CNAME
2. `npm run build` - Create React App production build
3. `npm run postbuild` - Copies 404.html for SPA routing
4. `npm run deploy` - Deploys to gh-pages branch

## Environment Configuration

**Required env vars (for full functionality):**
- `REACT_APP_EMAILJS_SERVICE_ID` - Required for contact form
- `REACT_APP_EMAILJS_TEMPLATE_ID` - Required for contact form
- `REACT_APP_EMAILJS_PUBLIC_KEY` - Required for contact form

**Example file:** `.env.example` available

**Secrets location:**
- `.env` file (gitignored)
- Environment variables set during build

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- EmailJS API calls (from Contact page)

## Security Measures

**HTTPS Enforcement:**
- Automatic redirect to HTTPS in production
- Implementation: `src/utils/httpsEnforcement.ts`
- Called on app initialization in `src/App.tsx`

**Input Sanitization:**
- XSS prevention via HTML escaping
- Script/iframe tag stripping
- Event handler removal
- Implementation: `src/utils/security.ts`

**Rate Limiting:**
- Client-side rate limiter class
- 5 attempts per minute per user identifier
- Implementation: `src/utils/security.ts`

**Spam Protection:**
- Honeypot field in contact form
- Implementation: `src/pages/Contact.tsx`

**Content Security:**
- Security headers constants defined
- External URL validation
- URL shortener blocking (bit.ly, tinyurl.com)
- Implementation: `src/utils/security.ts`, `src/utils/httpsEnforcement.ts`

## PWA Configuration

**Manifest (`public/manifest.json`):**
- App name: "Random Gorsey - Music & Visuals"
- Display: standalone
- Theme color: #282c34
- Background: #000000
- Icons: favicon.ico, logo192.png, logo512.png

## SEO Configuration

**Sitemap:**
- Location: `public/sitemap.xml`
- Domain: https://randomgorsey.com

**Robots.txt:**
- Location: `public/robots.txt`
- All bots allowed
- Sitemap reference included

**Structured Data:**
- JSON-LD WebSite schema in `public/index.html`
- Open Graph meta tags
- Twitter Card meta tags

**LLM Files:**
- `public/llms.txt` - Brief LLM context
- `public/llms-full.txt` - Extended LLM context

---

*Integration audit: 2026-01-17*
