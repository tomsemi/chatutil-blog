# ChatUtil Blog

Personal notes, learning summaries, and build logs published at:

```text
https://blog.chatutil.top
```

The site is built with Astro and deployed as Cloudflare Worker Static Assets.
The custom domain is tracked in `wrangler.jsonc`, so deployment and domain
binding stay in code.

## Write

Add Markdown files under `src/content/notes/`.

```md
---
title: "Title"
description: "Short summary for feeds and social previews."
date: 2026-06-05
tags: ["swift", "cloudflare"]
draft: false
---

Write the note here.
```

Draft notes can use:

```md
draft: true
```

Drafts are excluded from the published site.

## Run

```bash
pnpm install
pnpm dev
pnpm build
pnpm check
```

## Deploy

```bash
pnpm deploy
```

`pnpm deploy` runs:

```bash
pnpm build && wrangler deploy
```

The Worker serves the generated `dist/` assets and binds:

```text
blog.chatutil.top
```

## Page Views

The Worker includes a lightweight page-view counter:

- HTML page requests are counted server-side.
- Counts are stored in a Durable Object.
- The footer and homepage stats read from `/api/pv`.
- No cookies or user tracking are used.

Example:

```bash
curl "https://blog.chatutil.top/api/pv?path=%2F"
```

## Routes

```text
/                  Latest notes
/notes/:slug/      Note detail
/tags/             Tag index
/tags/:tag/        Notes by tag
/rss.xml           RSS feed
/robots.txt        Robots file
```

## Project Structure

```text
src/content/notes/   Markdown notes
src/pages/           Astro routes
src/layouts/         Shared layout
src/styles/          Global CSS
src/worker.ts        Cloudflare Worker entry
wrangler.jsonc       Worker, assets, Durable Object, and domain config
```
