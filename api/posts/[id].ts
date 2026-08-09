import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSql, rowToPost, type PostRow } from '../_lib/db.js'
import { persistPhotos } from '../_lib/photos.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string
  const sql = getSql()

  if (req.method === 'GET') {
    const rows = (await sql.query('SELECT * FROM posts WHERE id = $1', [id])) as PostRow[]
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    return res.status(200).json(rowToPost(rows[0]))
  }

  if (req.method === 'PUT') {
    const body = req.body
    const photos = await persistPhotos(id, body.photos)
    const rows = (await sql.query(
      `UPDATE posts
       SET country = $2, dish = $3, week_number = $4, date = $5,
           title = $6, content = $7, rating = $8, photos = $9
       WHERE id = $1
       RETURNING *`,
      [
        id,
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
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    return res.status(200).json(rowToPost(rows[0]))
  }

  if (req.method === 'DELETE') {
    const rows = await sql.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id])
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET, PUT, DELETE')
  return res.status(405).end()
}
