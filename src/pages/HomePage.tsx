import { Link } from 'react-router-dom'
import { useState } from 'react'
import { recipes } from '../data/recipes'
import { Flag } from '../components/Flag'
import { EarthGlobe } from '../components/EarthGlobe'

function toSlug(country: string) {
  return country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const DIFFICULTY_COLOR = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-red-100 text-red-700',
}

export default function HomePage() {
  const [search, setSearch] = useState('')

  const filtered = recipes.filter(
    r =>
      r.country.toLowerCase().includes(search.toLowerCase()) ||
      r.dish.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="bg-black min-h-screen -mt-0"><div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <EarthGlobe />
        <h2 className="font-serif text-4xl text-white mb-3">
          A Recipe from Every Country
        </h2>
        <p className="text-stone-400 text-lg max-w-xl mx-auto">
          One national dish per week, cooked in order — from Afghanistan to Zimbabwe.
          Follow along in the journal.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search country or dish…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-full border border-stone-300 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Progress */}
      <div className="mb-8 bg-white rounded-xl border border-stone-200 p-4 text-center shadow-sm">
        <p className="text-stone-500 text-sm">
          <span className="font-semibold text-amber-700">{recipes.length}</span> recipes ready to cook
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-stone-500 py-12">No results for "{search}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe, i) => (
            <Link
              key={recipe.country}
              to={`/recipe/${toSlug(recipe.country)}`}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-stone-400 font-mono">#{i + 1}</span>
              </div>
              <h3 className="font-serif text-lg text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
                {recipe.dish}
              </h3>
              <p className="text-sm text-stone-500 mt-0.5 mb-3 flex items-center gap-1.5"><Flag country={recipe.country} /> {recipe.country}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLOR[recipe.difficulty]}`}
                >
                  {recipe.difficulty}
                </span>
                <span className="text-xs text-stone-400">{recipe.totalTime}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div></div>
  )
}
