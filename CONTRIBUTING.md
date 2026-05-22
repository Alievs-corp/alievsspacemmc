# Contributing

Thanks for contributing to the Alievs Space MMC website. This repository tracks
the **company website frontend** (in `frontend/`) plus repository documentation.
The backend API and the academy app live in separate repositories.

## Prerequisites

- **Node.js 20.19+ or 22.12+** and **npm**
- Git

## Getting started

```bash
cd frontend
npm install
cp .env.example .env   # then set VITE_API_URL
npm run dev
```

Environment variables:

- `VITE_API_URL` — base URL of the API (e.g. `http://localhost:8080/api/v1`).
- `VITE_BASE_PATH` — Vite `base` path, only needed for sub-path hosting.

## Available scripts (run inside `frontend/`)

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

> There is no test runner configured yet. Verify changes with `npm run build`
> and the dev server.

## Workflow

1. **Branch off `main`.** Never commit directly to `main`.
   Use a descriptive, prefixed branch name, e.g. `feat/blog-page`,
   `fix/contact-form`, `chore/ci`.
2. **Make focused commits** using
   [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` a new feature
   - `fix:` a bug fix
   - `refactor:` / `style:` / `chore:` / `docs:` / `test:`
   - Example: `feat(home): wire hero to API content`
3. **Before pushing**, make sure the build is green:
   ```bash
   cd frontend && npm run build && npm run lint
   ```
4. **Open a Pull Request against `main`** and fill in the PR template.
   Keep PRs small and scoped; link any related issues.
5. A maintainer reviews and merges once CI passes.

## Code style

- **Styling:** Tailwind CSS v4. Use the semantic design tokens defined in
  `frontend/src/index.css` (`bg-bg`, `bg-surface`, `text-primary`,
  `border-border`, `font-display`, …) and the shared component classes
  (`.card`, `.panel`, `.field`). **Do not hardcode hex colors or ad-hoc px
  values** in components.
- Use the `cn()` helper (`@/lib/utils`) to compose class names.
- Prefer **Lucide** icons; keep one icon set per surface.
- Keep components typed; avoid `any`.
- All user-facing UI strings should go through the i18n helper `t()` and exist
  for `en`, `az`, and `ru`.

## Reporting issues

Use the issue templates (Bug report / Feature request). For **security
vulnerabilities**, follow [SECURITY.md](./SECURITY.md) — do not open a public
issue.

By contributing, you agree that your contributions are the property of Alievs
Space MMC under the repository [LICENSE](./LICENSE).
