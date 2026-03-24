import { useParams, Link, useNavigate } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Flag } from '../components/Flag'

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

function toSlug(country: string) {
  return country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const DIFFICULTY_COLOR = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
}

export default function RecipePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const index = recipes.findIndex(r => toSlug(r.country) === slug)
  const recipe = recipes[index]

  if (!recipe) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 text-lg">Recipe not found.</p>
        <Link to="/" className="text-amber-700 underline mt-4 inline-block">Back to all recipes</Link>
      </div>
    )
  }

  const prev = recipes[index - 1]
  const next = recipes[index + 1]

  const { posts } = useBlogPosts()
  const journalEntries = posts.filter(p => p.country === recipe.country)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-stone-500 hover:text-amber-700 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <p className="text-sm text-stone-400 font-sans uppercase tracking-widest flex items-center gap-2">
              #{index + 1} · <Flag country={recipe.country} /> {recipe.country}
            </p>
            <h1 className="font-serif text-4xl text-stone-800 leading-tight">{recipe.dish}</h1>
          </div>
        </div>
        <p className="text-stone-600 mt-4 text-base leading-relaxed">{recipe.description}</p>
      </div>

      {/* Meta strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Prep', value: recipe.prepTime },
          { label: 'Cook', value: recipe.cookTime },
          { label: 'Total', value: recipe.totalTime },
          { label: 'Serves', value: recipe.servings.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-stone-200 px-4 py-3 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="font-semibold text-stone-800 text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}>
          {recipe.difficulty} difficulty
        </span>
      </div>

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="font-serif text-2xl text-stone-800 mb-4">Ingredients</h2>
        <ul className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {recipe.ingredients.map((ingredient, i) => (
            <li key={i} className="px-5 py-3 text-sm text-stone-700 flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 shrink-0">▪</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section className="mb-8">
        <h2 className="font-serif text-2xl text-stone-800 mb-4">Instructions</h2>
        <ol className="space-y-4">
          {recipe.instructions.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white text-sm font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-stone-700 text-sm leading-relaxed pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-2xl text-stone-800 mb-4">Tips</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
            {recipe.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 text-sm text-stone-700">
                <span className="shrink-0 text-amber-600">💡</span>
                {tip}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notes */}
      {recipe.notes && (
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-stone-800 mb-4">About This Dish</h2>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <p className="text-sm text-stone-600 leading-relaxed italic">{recipe.notes}</p>
          </div>
        </section>
      )}

      {/* Journal entries */}
      {journalEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-2xl text-stone-800 mb-4">Journal Entries</h2>
          <div className="space-y-3">
            {journalEntries.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="block bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-400 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 text-sm mt-1 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-amber-500 text-sm">{STARS(post.rating)}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Write journal entry CTA */}
      <div className="bg-amber-700 text-white rounded-xl p-6 mb-10 text-center">
        <p className="font-serif text-xl mb-2">Made this dish?</p>
        <p className="text-amber-100 text-sm mb-4">Write about your experience in your weekly journal.</p>
        <Link
          to={`/blog/new?country=${encodeURIComponent(recipe.country)}&dish=${encodeURIComponent(recipe.dish)}&week=${index + 1}`}
          className="inline-block bg-white text-amber-700 font-semibold text-sm px-5 py-2 rounded-full hover:bg-amber-50 transition-colors"
        >
          Write Blog Entry
        </Link>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between gap-4">
        {prev ? (
          <Link
            to={`/recipe/${toSlug(prev.country)}`}
            className="flex-1 bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-400 transition-all text-left group"
          >
            <p className="text-xs text-stone-400 mb-1">← Previous</p>
            <p className="font-serif text-stone-800 group-hover:text-amber-700 transition-colors">
              {prev.dish}
            </p>
            <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5"><Flag country={prev.country} /> {prev.country}</p>
          </Link>
        ) : <div className="flex-1" />}

        {next ? (
          <Link
            to={`/recipe/${toSlug(next.country)}`}
            className="flex-1 bg-white rounded-xl border border-stone-200 p-4 hover:border-amber-400 transition-all text-right group"
          >
            <p className="text-xs text-stone-400 mb-1">Next →</p>
            <p className="font-serif text-stone-800 group-hover:text-amber-700 transition-colors">
              {next.dish}
            </p>
            <p className="text-xs text-stone-400 flex items-center justify-end gap-1 mt-0.5"><Flag country={next.country} /> {next.country}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}
