# Oundnote landing page

This repository contains the redesigned Oundnote marketing and product-explainer site.

The original Pear frontend has been completely reworked around the **Oundnote** project: private local AI meeting memory, transcription, speaker diarization, searchable meeting knowledge, RAG, and a bounded local MCP bridge for desktop AI clients.

## Source project

- Oundnote: https://github.com/Aravindh-dev12/oundnote
- Product site: https://oundnote.eu

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm install --frozen-lockfile
pnpm exec vite build
```

The Vercel configuration builds the Vite SPA into `dist/public` and applies a single SPA fallback for client-side routing.
