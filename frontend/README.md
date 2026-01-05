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

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:8080/api/v1
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

- Multi-language support (en, az, ru)
- Responsive design
- API integration with backend
- Dynamic content loading
- Contact form with lead submission

## Pages

- `/` - Home
- `/about` - About us
- `/services` - Services
- `/projects` - Case studies
- `/projects/:id` - Project details
- `/blog` - Blog listing
- `/blog/:id` - Blog post
- `/careers` - Career openings
- `/contact` - Contact form
- `/industries` - Industries

## API Integration

The app connects to the backend API defined in `alievsspacemmc-api`. Make sure the API server is running before starting the frontend.
