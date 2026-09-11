# Pear

A Vite + React implementation of the Pear landing-page experience.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAravindh-dev12%2FPear&project-name=pear)

## Production build

```bash
pnpm install --frozen-lockfile
pnpm exec vite build
```

Vite builds the frontend to `dist/public`. The root `vercel.json` contains the Vercel build settings, SPA fallback, and production media/font rewrites required by the current implementation.

## Local development

```bash
pnpm install
pnpm dev
```
