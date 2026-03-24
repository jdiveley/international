import { useState, useEffect } from 'react'
import type { BlogPost } from '../types'

const API = '/api/posts'

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}?_sort=-id`)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => { setPosts([]); setLoading(false) })
  }, [])

  async function addPost(post: Omit<BlogPost, 'id'>): Promise<string> {
    const newPost: BlogPost = { ...post, id: Date.now().toString() }
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })
    const saved: BlogPost = await res.json()
    setPosts(prev => [saved, ...prev])
    return saved.id
  }

  async function deletePost(id: string) {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  function getPost(id: string) {
    return posts.find(p => p.id === id)
  }

  return { posts, loading, addPost, deletePost, getPost }
}
