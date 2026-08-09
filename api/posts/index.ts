import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql, rowToPost, type PostRow } from '../_lib/db.js'
import { persistPhotos } from '../_lib/photos.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = getSql()

  if (req.method === 'GET') {
    const rows = (await sql.query('SELECT * FROM posts ORDER BY week_number ASC')) as PostRow[]
    return res.status(200).json(rows.map(rowToPost))
  }

  if (req.method === 'POST') {
    const body = req.body
    if (!body?.id) return res.status(400).json({ error: 'id is required' })

    const photos = await persistPhotos(body.id, body.photos)
    const rows = (await sql.query(
      `INSERT INTO posts (id, country, dish, week_number, date, title, content, rating, photos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        body.id,
        body.country,
        body.dish,
        body.weekNumber,
        body.date,
        body.title,
        body.content,
        body.rating,
        JSON.stringify(photos),
      ]
    )) as PostRow[]
    return res.status(201).json(rowToPost(rows[0]))
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).end()
}
