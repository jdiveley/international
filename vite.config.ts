import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import { recipes } from './src/data/recipes'

function toSlug(country: string) {
  return country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function toISO8601Duration(time: string): string {
  const hours = time.match(/(\d+)\s*h/i)?.[1]
  const minutes = time.match(/(\d+)\s*m/i)?.[1]
  let result = 'PT'
  if (hours) result += `${hours}H`
  if (minutes) result += `${minutes}M`
  return result || 'PT0M'
}

function recipePrerender() {
  return {
    name: 'recipe-prerender',
    closeBundle() {
      const indexHtml = fs.readFileSync('dist/index.html', 'utf-8')
      for (const recipe of recipes) {
        const slug = toSlug(recipe.country)
        const jsonLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: recipe.dish,
          description: recipe.description,
          recipeCuisine: recipe.country,
          prepTime: toISO8601Duration(recipe.prepTime),
          cookTime: toISO8601Duration(recipe.cookTime),
          totalTime: toISO8601Duration(recipe.totalTime),
          recipeYield: `${recipe.servings} servings`,
          recipeIngredient: recipe.ingredients,
          recipeInstructions: recipe.instructions.map(text => ({
            '@type': 'HowToStep',
            text,
          })),
        })
        const html = indexHtml.replace(
          '</head>',
          `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`
        )
        const dir = `dist/recipe/${slug}`
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(`${dir}/index.html`, html)
      }
      console.log(`[recipe-prerender] Wrote ${recipes.length} recipe pages`)
    },
  }
}

export default defineConfig({
  plugins: [react(), recipePrerender()],
  server: {
    host: true,
    allowedHosts: ['international.dirthawker.net', 'international.diveley.net'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
