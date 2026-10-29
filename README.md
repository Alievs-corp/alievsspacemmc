# Alievs Space MMC — Company Website

[![CI](https://github.com/Alievs-corp/alievsspacemmc/actions/workflows/ci.yml/badge.svg)](https://github.com/Alievs-corp/alievsspacemmc/actions/workflows/ci.yml)

The official website of **Alievs Space MMC**, a technology company building modern,
scalable software products. This repository contains the **company website
frontend** (in `frontend/`) and repository documentation. The backend API and the
academy app are maintained in separate repositories.

## Tech stack

- **Vite 7** + **React 18** + **TypeScript**
- **React Router 7**
- **Tailwind CSS v4** (design tokens via `@theme` in `src/index.css`)
- **Lucide** icons
- Hand-rolled i18n (`en` / `az` / `ru`)

## Getting started

```bash
cd frontend
npm install
cp .env.example .env   # then set VITE_API_URL
npm run dev
```

Environment variables:

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `VITE_API_URL` | Base URL of the API | `http://localhost:8080/api/v1` |
| `VITE_BASE_PATH` | Vite `base` path (sub-path hosting only) | — |

### Scripts (run inside `frontend/`)

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Project structure

```
.
├── frontend/            # Company website (Vite + React + Tailwind) — tracked here
│   ├── src/
│   │   ├── components/   # Layout, UI, and admin components
│   │   ├── pages/        # Public pages + admin panel (/admin/*)
│   │   ├── contexts/     # i18n, auth, content providers
│   │   └── lib/          # API client, i18n, utilities
│   └── ...
├── .github/             # CI workflow, issue/PR templates
└── README.md
```

> The backend API (`alievsspacemmc-api`) and academy app (`alievsspace-academy`)
> live in their own repositories.

## Accounts, roles and the admin panel

- `/register`, `/login` and `/profile` are open to everyone; every new account is a **USER**.
- `/admin/*` is the admin panel (own layout, separate bundle). **ADMIN** sees only the sections a
  super admin granted (content, inquiries, applications, academy, users); **SUPER ADMIN** also gets
  Administrators, API & integrations, System settings and the Audit log.
- The browser only hides what a role can't use — every permission is enforced by the API
  (`alievsspacemmc-api`), which also writes the audit log.
- The first super admin is granted on the API server with
  `alievsspacemmc-admin promote-super-admin --email <email>` (see the API README).

## Contributing

Contributions follow a feature-branch + Pull Request workflow with
[Conventional Commits](https://www.conventionalcommits.org/). See
[CONTRIBUTING.md](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Security

Please report vulnerabilities privately — see [SECURITY.md](./SECURITY.md). Do not
open public issues for security problems.

## License

Proprietary — © Alievs Space MMC. All rights reserved. See [LICENSE](./LICENSE).

---

### About Alievs Space MMC

We specialize in the design and development of modern software solutions — web and
mobile applications, APIs and backend systems, real-time communication, and
DevOps/infrastructure — combining innovation, technical expertise, and reliability.

**Alievs Space MMC** — Building premium digital products that scale.
