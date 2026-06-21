import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Flag } from '../components/Flag'
import { weekLabel } from '../utils/weekOf'

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

const SESSION_KEY = 'journal-auth'

type SortKey = 'newest' | 'oldest' | 'week-desc' | 'week-asc' | 'rating'

const SORT_LABELS: Record<SortKey, string> = {
  'newest': 'Newest first',
  'oldest': 'Oldest first',
  'week-desc': 'Week (high → low)',
  'week-asc': 'Week (low → high)',
  'rating': 'Rating',
}

export default function BlogPage() {
  const { posts, loading } = useBlogPosts()
  const isOwner = sessionStorage.getItem(SESSION_KEY) === '1'
  const [sort, setSort] = useState<SortKey>('newest')

  const sorted = useMemo(() => {
    const copy = [...posts]
    switch (sort) {
      case 'newest':    return copy.sort((a, b) => b.date.localeCompare(a.date))
      case 'oldest':    return copy.sort((a, b) => a.date.localeCompare(b.date))
      case 'week-desc': return copy.sort((a, b) => b.weekNumber - a.weekNumber)
      case 'week-asc':  return copy.sort((a, b) => a.weekNumber - b.weekNumber)
      case 'rating':    return copy.sort((a, b) => b.rating - a.rating)
    }
  }, [posts, sort])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-4xl text-stone-800">Blog</h2>
          <p className="text-stone-500 mt-1">Weekly reflections on cooking through the world.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="text-sm border border-stone-200 rounded-full px-3 py-1.5 text-stone-600 bg-white hover:border-stone-300 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map(k => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
          {isOwner && (
            <Link
              to="/blog/new"
              className="bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-amber-800 transition-colors whitespace-nowrap"
            >
              + New Entry
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📖</p>
          <p className="font-serif text-xl text-stone-600 mb-2">No entries yet</p>
          <p className="text-stone-400 text-sm mb-6">
            Cook a recipe and write about your experience here.
          </p>
          <Link
            to="/"
            className="text-amber-700 underline text-sm hover:text-amber-800"
          >
            Browse the recipes →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="block bg-white rounded-xl border border-stone-200 p-6 hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Week {post.weekNumber}
                    </span>
                    <span className="text-xs text-stone-400">{weekLabel(post.weekNumber)}</span>
                    <span className="text-xs text-stone-300">·</span>
                    <span className="text-xs text-stone-400 flex items-center gap-1"><Flag country={post.country} /> {post.country}</span>
                  </div>
                  <h3 className="font-serif text-xl text-stone-800 group-hover:text-amber-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">{post.dish}</p>
                  <p className="text-stone-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-amber-500 text-sm">{STARS(post.rating)}</p>
                  <p className="text-xs text-stone-400 mt-1">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
