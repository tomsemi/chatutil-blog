# ChatUtil Blog

Personal notes and learning summaries for `blog.chatutil.top`.

## Write

Add Markdown files under `src/content/notes/`.

```md
---
title: "Title"
description: "Short summary for feeds and social previews."
date: 2026-06-05
tags: ["swift", "cloudflare"]
---

Write the note here.
```

## Run

```bash
pnpm install
pnpm dev
pnpm build
```

## Deploy

This site deploys as a Cloudflare Worker with Static Assets, so the custom
domain is tracked in `wrangler.jsonc`.

Deploy:

```bash
pnpm deploy
```
