-- Blog posts table (replaces db.json / json-server for production on Vercel).
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  dish TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
