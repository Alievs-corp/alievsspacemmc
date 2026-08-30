# Frontend - Alievs Space MMC

Professional React + TypeScript + TailwindCSS web application for Alievs Space MMC.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Client-side routing

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout/      # Header, Footer, Layout wrapper
│   ├── contexts/        # React contexts (i18n, content)
│   ├── lib/            # Utilities and API client
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
# Canonical origin used for canonical/hreflang/OG tags and JSON-LD.
# Must match the deployed domain or search engines will index the wrong URLs.
VITE_SITE_URL=https://alievsspace.com
```

4. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- 10 languages: en, az, ru, de, fr, ka, zh, ja, ko, vi
- Currency switcher: AZN (base), USD, EUR, GEL
- Per-page SEO: canonical, hreflang, Open Graph, JSON-LD
- Responsive design
- API integration with backend
- Contact form with lead submission

## Pages

- `/` - Home
- `/packages` - Website packages and pricing (`/pricing` redirects here)
- `/process` - How we work
- `/faq` - Frequently asked questions
- `/services` - Services
- `/case-studies` - Case studies
- `/case-studies/:slug` - Case study details
- `/industries` - Industries
- `/about` - About us
- `/contact` - Contact form
- `/careers` - Career openings
- `/privacy-policy`, `/terms-of-service`, `/refund-policy`, `/cookie-policy` - Legal

## Internationalisation

`src/lib/i18n.ts` merges two layers per locale and falls back to English for
anything missing, so a partially translated language still renders completely:

- `src/locales/{en,ru,az}.ts` - full page copy for the original three locales.
- `src/locales/extra/*.ts` - marketing, pricing, FAQ and SEO copy for all ten.

The active language resolves once per session, in this order: `?lang=xx` in the
URL, the visitor's previous choice, the browser language, then `az`. The CMS
stores content for en/az/ru only; `toCmsLocale()` in `src/lib/api.ts` maps any
other UI language to English for those requests.

## Pricing and currency

Package prices live in `src/data/packages.ts` in **AZN** and are converted at
display time by `src/lib/currency.ts`, which holds the indicative rates. Update
the rates there when they drift; the amounts on every page follow automatically.

## SEO

- `<Seo>` (`src/components/Seo.tsx`) sets title, description, canonical,
  hreflang, Open Graph, Twitter and per-page JSON-LD. `<OrganizationSchema>`
  emits Organization / WebSite / ProfessionalService once, from the layout.
- `public/robots.txt` and `public/sitemap.xml` are static - **regenerate the
  sitemap when routes change**, and update both if the domain changes.
- The site is client-rendered, so the host must serve `index.html` for unknown
  paths (SPA fallback). Without that rewrite, direct hits and crawler requests
  to `/packages` and friends return 404.

## API Integration

The app connects to the backend API defined in `alievsspacemmc-api`. Make sure the API server is running before starting the frontend.
