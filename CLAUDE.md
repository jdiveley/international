# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Type-check (tsc) then bundle to dist/
npm run preview  # Preview the production build locally
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
