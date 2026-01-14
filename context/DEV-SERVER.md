# Dev Server Runbook

A minimal reference for running the Vite dev server reliably.

## Defaults

- Port: 8080 by default (as documented in AGENTS.md)
- URL: <http://localhost:8080>
- Local + LAN access enabled
- SPA fallback enabled (deep links won’t 404 in dev or preview)

## Flexible Port Selection

The dev server prefers 8080. If 8080 is busy, it automatically uses a free port.

Override or enforce behavior via env vars:

- Override port: PORT=3001 npm run dev
- Enforce strict 8080 (fail if taken): STRICT_PORT=true npm run dev
- CI will automatically enforce strict 8080 when CI is set.

## Freeing 8080 on macOS

If you need to free port 8080:

```bash
lsof -i :8080
kill -9 <PID>
```

## Deep-Link Checks (SPA)

Deep links should load without a 404 in both dev and preview:

- Start dev: npm run dev
- Navigate directly to a route (e.g., /mining-tech-survey/option-a)
- Refresh the page — it should render (no 404)

## Preview vs Dev

- Dev: npm run dev — fast refresh, HMR
- Preview: npm run build && npm run preview — serves build output; also SPA-friendly

## Troubleshooting Quick Hits

- Conflicting server on 8080? Use PORT=3001 npm run dev or free 8080 (see above).
- Browser hitting the wrong host? Prefer the “Local” URL (<http://localhost:8080>) printed by Vite.
- Changed base path or router type? Revisit src/App.tsx (BrowserRouter) and ensure base remains '/'.
- Still seeing 404s? Check browser console for our NotFound log or Network tab for which server is answering the request.
