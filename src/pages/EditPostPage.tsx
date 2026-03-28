import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
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
      <p className="text-stone-500 text-sm mb-8">Enter the password to edit this entry.</p>
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

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPost, updatePost, loading } = useBlogPosts()
  const [unlocked, setUnlocked] = useState(sessionStorage.getItem(SESSION_KEY) === '1')

  const post = id ? getPost(id) : undefined

  const [country, setCountry] = useState(post?.country ?? '')
  const [dish, setDish] = useState(post?.dish ?? '')
  const [weekNumber, setWeekNumber] = useState(String(post?.weekNumber ?? ''))
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [rating, setRating] = useState(post?.rating ?? 3)
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().split('T')[0])
  const [photos, setPhotos] = useState<string[]>(post?.photos ?? [])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-stone-400">Loading…</div>

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 text-lg">Journal entry not found.</p>
        <Link to="/blog" className="text-amber-700 underline mt-4 inline-block">Back to journal</Link>
      </div>
    )
  }

  function compressImage(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = ev => {
        const img = new Image()
        img.onload = () => {
          const MAX = 1200
          const scale = Math.min(1, MAX / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.8))
        }
        img.src = ev.target!.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      compressImage(file).then(dataUrl => {
        setPhotos(prev => [...prev, dataUrl])
      })
    })
    e.target.value = ''
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  function handleCountryChange(value: string) {
    setCountry(value)
    const found = recipes.find(r => r.country === value)
    if (found) {
      setDish(found.dish)
      setWeekNumber(String(recipes.indexOf(found) + 1))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!country || !dish || !title || !content || !weekNumber) {
      setError('Please fill in all fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await updatePost(id!, {
        country,
        dish,
        weekNumber: parseInt(weekNumber),
        title,
        content,
        rating,
        date,
        photos,
      })
      navigate(`/blog/${id}`)
    } catch (err) {
      setError(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setSubmitting(false)
    }
  }

  const labelClass = 'block text-sm font-medium text-stone-700 mb-1'
  const inputClass =
    'w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        to={`/blog/${id}`}
        className="text-sm text-stone-500 hover:text-amber-700 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Back to entry
      </Link>

      <h1 className="font-serif text-3xl text-stone-800 mb-8">Edit Journal Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Country</label>
          <select value={country} onChange={e => handleCountryChange(e.target.value)} className={inputClass}>
            <option value="">Select a country…</option>
            {recipes.map(r => (
              <option key={r.country} value={r.country}>{r.flag} {r.country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Dish</label>
          <input type="text" value={dish} onChange={e => setDish(e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Week #</label>
            <input type="number" min="1" value={weekNumber} onChange={e => setWeekNumber(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date cooked</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
          </div>
        </div>

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

        <div>
          <label className={labelClass}>Entry title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Your experience</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className={labelClass}>Photos</label>
          <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border border-dashed border-stone-300 rounded-lg text-sm text-stone-500 hover:border-amber-400 hover:text-amber-700 transition-colors">
            <span>+ Add photos</span>
            <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
          </label>
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {photos.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="w-24 h-24 object-cover rounded-lg border border-stone-200" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 bg-white border border-stone-200 text-stone-500 hover:text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-700 text-white font-medium px-6 py-2.5 rounded-full hover:bg-amber-800 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/blog/${id}`)}
            className="text-stone-500 hover:text-stone-700 text-sm px-4 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
