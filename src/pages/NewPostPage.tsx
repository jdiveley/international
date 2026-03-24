import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { recipes } from '../data/recipes'

const SESSION_KEY = 'journal-auth'

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === 'hairymonster') {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-24 text-center">
      <p className="text-4xl mb-6">🔒</p>
      <h2 className="font-serif text-2xl text-stone-800 mb-2">Journal is private</h2>
      <p className="text-stone-500 text-sm mb-8">Enter the password to write a new entry.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
          className="w-full px-4 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-center"
        />
        {error && <p className="text-red-500 text-sm">Incorrect password.</p>}
        <button
          type="submit"
          className="w-full bg-amber-700 text-white font-medium px-6 py-2.5 rounded-full hover:bg-amber-800 transition-colors text-sm"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}

export default function NewPostPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { addPost } = useBlogPosts()
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem(SESSION_KEY) === '1')

  const preCountry = params.get('country') ?? ''
  const preDish = params.get('dish') ?? ''
  const preWeek = params.get('week') ?? ''

  const [country, setCountry] = useState(preCountry)
  const [dish, setDish] = useState(preDish)
  const [weekNumber, setWeekNumber] = useState(preWeek)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(3)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  // Auto-fill dish when country is selected from dropdown
  function handleCountryChange(value: string) {
    setCountry(value)
    const found = recipes.find(r => r.country === value)
    if (found) {
      setDish(found.dish)
      const idx = recipes.indexOf(found)
      setWeekNumber(String(idx + 1))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!country || !dish || !title || !content || !weekNumber) {
      setError('Please fill in all fields.')
      return
    }
    const id = await addPost({
      country,
      dish,
      weekNumber: parseInt(weekNumber),
      title,
      content,
      rating,
      date,
    })
    navigate(`/blog/${id}`)
  }

  const labelClass = 'block text-sm font-medium text-stone-700 mb-1'
  const inputClass =
    'w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        to="/blog"
        className="text-sm text-stone-500 hover:text-amber-700 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Journal
      </Link>

      <h1 className="font-serif text-3xl text-stone-800 mb-8">New Journal Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Country */}
        <div>
          <label className={labelClass}>Country</label>
          <select
            value={country}
            onChange={e => handleCountryChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a country…</option>
            {recipes.map(r => (
              <option key={r.country} value={r.country}>
                {r.flag} {r.country}
              </option>
            ))}
          </select>
        </div>

        {/* Dish */}
        <div>
          <label className={labelClass}>Dish</label>
          <input
            type="text"
            value={dish}
            onChange={e => setDish(e.target.value)}
            className={inputClass}
            placeholder="Dish name"
          />
        </div>

        {/* Week + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Week #</label>
            <input
              type="number"
              min="1"
              value={weekNumber}
              onChange={e => setWeekNumber(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Date cooked</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className={labelClass}>Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-2xl transition-transform hover:scale-110 ${n <= rating ? 'text-amber-500' : 'text-stone-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className={labelClass}>Entry title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={inputClass}
            placeholder="How did it go? Give it a title."
          />
        </div>

        {/* Content */}
        <div>
          <label className={labelClass}>Your experience</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            className={`${inputClass} resize-y`}
            placeholder="Write about what it was like to cook and eat this dish. How did it turn out? What would you change? What surprised you?"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-amber-700 text-white font-medium px-6 py-2.5 rounded-full hover:bg-amber-800 transition-colors text-sm"
          >
            Save entry
          </button>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="text-stone-500 hover:text-stone-700 text-sm px-4 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
