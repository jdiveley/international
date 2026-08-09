import { useBlogPosts } from './useBlogPosts'

export function useCooked() {
  const { posts } = useBlogPosts()
  const isCooked = (country: string) => posts.some(p => p.country === country)
  return { isCooked }
}
