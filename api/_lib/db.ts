import { neon } from '@neondatabase/serverless'

export function getSql() {
  return neon(process.env.DATABASE_URL!)
}

export interface PostRow {
  id: string
  country: string
  dish: string
  week_number: number
  date: string
  title: string
  content: string
  rating: number
  photos: string[]
}

// DB rows use snake_case; the client's BlogPost type uses camelCase.
export function rowToPost(row: PostRow) {
  return {
    id: row.id,
    country: row.country,
    dish: row.dish,
    weekNumber: row.week_number,
    date: row.date,
    title: row.title,
    content: row.content,
    rating: row.rating,
    photos: row.photos ?? [],
  }
}
