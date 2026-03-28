import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = 4173

const app = express()

// Proxy /api/* to json-server (strips /api prefix)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}))

// Serve pre-rendered static files (serves directory index.html files by path)
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback for any client-side routes not matched above
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`Serving on port ${PORT}`))
