// One-off: applies scripts/schema.sql to the Neon database pointed to by
// DATABASE_URL. Run via: npx dotenv -e .env.local -- node scripts/apply-schema.mjs
import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'node:fs'

const sql = neon(process.env.DATABASE_URL)
const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf-8')

await sql.query(schema)
console.log('Schema applied.')
