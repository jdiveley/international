# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Type-check (tsc) then bundle to dist/ + prerender recipe pages
npm run preview  # Preview the production build locally (port 4173)
npm run lint     # ESLint
```

## Architecture

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v3 + React Router v7

### Routing (`src/App.tsx`)
All routes live under a shared `<Layout>` (nav + footer). Routes:
- `/` — Home: country grid with search
- `/recipe/:slug` — Full recipe (slug = country name lowercased, spaces → hyphens, symbols removed)
- `/blog` — Journal listing
- `/blog/:id` — Single journal entry
- `/blog/:id/edit` — Edit an existing entry (password-gated)
- `/blog/new` — New entry form (accepts `?country=&dish=&week=` query params pre-filled from recipe pages)

### Data (`src/data/recipes.ts`)
Single exported `recipes: Recipe[]` array, sorted alphabetically by country. Each entry includes `country`, `flag` (emoji), `dish`, `description`, `prepTime`, `cookTime`, `totalTime`, `servings`, `difficulty`, `ingredients[]`, `instructions[]`, `tips[]`, `notes`. Types defined in `src/types.ts`.

To add more countries: append to the `recipes` array in `src/data/recipes.ts`. The array index (0-based) determines the recipe number shown in the UI, so always keep it alphabetically sorted.

### Cooked meals (`src/hooks/useCooked.ts`)
`useCooked()` exposes `{ isCooked, toggle }` — tracks which meals have been made, persisted in `localStorage` under the key `cooked-meals` (a JSON array of country name strings). A ✅ button appears on the recipe page header and on each home page card (visible on hover when not cooked, always visible when cooked). The card also gets a green tint when marked.

### Blog / Journal (`src/hooks/useBlogPosts.ts`)
Posts are stored in `db.json` via json-server (REST API at `http://localhost:3001`). The `useBlogPosts()` hook exposes `{ posts, loading, addPost, updatePost, deletePost, getPost }`.

- Posts support optional `photos?: string[]` — base64 JPEG data URLs, auto-compressed to max 1200px / 80% quality via Canvas before upload.
- Edit page (`EditPostPage`) uses `useEffect` to populate form fields after the async fetch completes — do not use `useState` initializers directly from `getPost()` since data isn't available on first render.

### Slug utility
Both `HomePage` and `RecipePage` use the same inline slug function — if you refactor it, extract to `src/utils/slug.ts` and update both pages.

### Schema.org / Mealie import
`RecipePage` renders a `<script type="application/ld+json">` tag with Schema.org Recipe structured data so Mealie can import recipes by URL.

The build also pre-renders static HTML files: the `recipePrerender` Vite plugin in `vite.config.ts` runs after every `npm run build` and writes `dist/recipe/[slug]/index.html` for all 196 recipes, each containing the JSON-LD in `<head>`. This is necessary because Mealie's scraper doesn't execute JavaScript.

### Production deployment
Two pm2 processes:

**`keli-json-server`** — json-server on port 3001, watches `db.json`:
```bash
pm2 start bash --name "keli-json-server" -- -c "npm run server"
```

**`world-recipes`** — Express static server on port 4173 (`static-server.js`):
```bash
pm2 start node --name "world-recipes" -- /home/keli/projects/keli/static-server.js
```

`static-server.js` proxies `/api/*` to json-server on port 3001 (via `http-proxy-middleware`) and serves pre-rendered static files from `dist/`. The proxy is essential — `vite preview` and `serve` don't support proxying, so API calls would silently 404 without it.

After any code change: `npm run build` then `pm2 restart world-recipes`.
