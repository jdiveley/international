import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { Flag } from '../components/Flag'

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
const SESSION_KEY = 'journal-auth'

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPost, deletePost, loading } = useBlogPosts()
  const isOwner = sessionStorage.getItem(SESSION_KEY) === '1'

  const post = id ? getPost(id) : undefined

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-stone-400">Loading…</div>
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 text-lg">Journal entry not found.</p>
        <Link to="/blog" className="text-amber-700 underline mt-4 inline-block">Back to journal</Link>
      </div>
    )
  }

  async function handleDelete() {
    if (confirm('Delete this journal entry?')) {
      await deletePost(post!.id)
      navigate('/blog')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate('/blog')}
        className="text-sm text-stone-500 hover:text-amber-700 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Journal
      </button>

      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            Week {post.weekNumber}
          </span>
          <span className="text-xs text-stone-400 flex items-center gap-1">
            <Flag country={post.country} /> {post.country} · {post.dish}
          </span>
        </div>

        <h1 className="font-serif text-3xl text-stone-800 mb-3 leading-snug">{post.title}</h1>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
          <p className="text-amber-500 text-lg">{STARS(post.rating)}</p>
          <p className="text-sm text-stone-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>

        <div className="prose prose-stone max-w-none">
          {post.content.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="text-stone-700 leading-relaxed mb-4 text-base">
                {para}
              </p>
            ) : null,
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Link
          to={`/recipe/${post.country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
          className="text-sm text-amber-700 hover:underline"
        >
          View the {post.dish} recipe →
        </Link>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete entry
          </button>
        )}
      </div>
    </div>
  )
}
