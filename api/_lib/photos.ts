import { put } from '@vercel/blob'

// The client sends photos as base64 data URLs for newly-added images and as
// plain Blob URLs (https://...) for photos already uploaded on a prior save.
// Upload only the new ones and return the full array as public Blob URLs.
export async function persistPhotos(postId: string, photos: string[] = []): Promise<string[]> {
  return Promise.all(
    photos.map(async (photo, i) => {
      const match = photo.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!match) return photo // already a Blob URL (or unrecognized — pass through)
      const [, mime, base64] = match
      const ext = mime.split('/')[1] || 'jpg'
      const buffer = Buffer.from(base64, 'base64')
      const blob = await put(`blog/${postId}/${Date.now()}-${i}.${ext}`, buffer, {
        access: 'public',
        contentType: mime,
        addRandomSuffix: true,
      })
      return blob.url
    })
  )
}
