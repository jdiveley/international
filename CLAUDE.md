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
- `/blog/new` — New entry form (accepts `?country=&dish=&week=` query params pre-filled from recipe pages)

### Data (`src/data/recipes.ts`)
Single exported `recipes: Recipe[]` array, sorted alphabetically by country. Each entry includes `country`, `flag` (emoji), `dish`, `description`, `prepTime`, `cookTime`, `totalTime`, `servings`, `difficulty`, `ingredients[]`, `instructions[]`, `tips[]`, `notes`. Types defined in `src/types.ts`.

To add more countries: append to the `recipes` array in `src/data/recipes.ts`. The array index (0-based) determines the recipe number shown in the UI, so always keep it alphabetically sorted.

### Blog / Journal (`src/hooks/useBlogPosts.ts`)
Posts are persisted in `localStorage` under the key `world-recipes-blog-posts`. The `useBlogPosts()` hook exposes `{ posts, addPost, deletePost, getPost }`. No backend required.

### Slug utility
Both `HomePage` and `RecipePage` use the same inline slug function — if you refactor it, extract to `src/utils/slug.ts` and update both pages.

### Schema.org / Mealie import
`RecipePage` renders a `<script type="application/ld+json">` tag with Schema.org Recipe structured data so Mealie can import recipes by URL.

The build also pre-renders static HTML files: the `recipePrerender` Vite plugin in `vite.config.ts` runs after every `npm run build` and writes `dist/recipe/[slug]/index.html` for all 196 recipes, each containing the JSON-LD in `<head>`. This is necessary because Mealie's scraper doesn't execute JavaScript.

### Production deployment
Production is served by `serve` (static file server, not `vite preview`) via pm2 on port 4173:
```bash
pm2 start serve --name "world-recipes" -- /home/keli/projects/keli/dist -l 4173
```
`serve` (without `-s`) serves pre-rendered per-recipe HTML files directly by path, while React Router handles client-side navigation for app routes.
