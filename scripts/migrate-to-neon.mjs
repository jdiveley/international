// One-off migration: uploads db.json's base64 post photos to Vercel Blob and
// inserts the posts into the Neon `posts` table.
// Run via: npx dotenv -e .env.local -- node scripts/migrate-to-neon.mjs
import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { readFileSync } from 'node:fs'

const sql = neon(process.env.DATABASE_URL)
const db = JSON.parse(readFileSync(new URL('../db.json', import.meta.url), 'utf-8'))

async function uploadPhotos(postId, photos = []) {
  return Promise.all(
    photos.map(async (photo, i) => {
      const match = photo.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!match) return photo
      const [, mime, base64] = match
      const ext = mime.split('/')[1] || 'jpg'
      const buffer = Buffer.from(base64, 'base64')
      const blob = await put(`blog/${postId}/${i}.${ext}`, buffer, {
        access: 'public',
        contentType: mime,
        addRandomSuffix: true,
      })
      return blob.url
    })
  )
}

let count = 0
for (const post of db.posts) {
  const photos = await uploadPhotos(post.id, post.photos)
  await sql.query(
    `INSERT INTO posts (id, country, dish, week_number, date, title, content, rating, photos)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       country = EXCLUDED.country, dish = EXCLUDED.dish, week_number = EXCLUDED.week_number,
       date = EXCLUDED.date, title = EXCLUDED.title, content = EXCLUDED.content,
       rating = EXCLUDED.rating, photos = EXCLUDED.photos`,
    [
      post.id,
      post.country,
      post.dish,
      post.weekNumber,
      post.date,
      post.title,
      post.content,
      post.rating,
      JSON.stringify(photos),
    ]
  )
  count++
  console.log(`Migrated ${post.country} (${photos.length} photos)`)
}

console.log(`Done. Migrated ${count} posts.`)
