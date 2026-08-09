// Patches milliparsec's default JSON payload limit from 100KiB to 10MiB.
// json-server uses milliparsec with no explicit limit, hitting the 100KiB default
// which is too small for base64-encoded photo uploads.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const path = join(root, 'node_modules/milliparsec/dist/index.js')

const original = 'const defaultPayloadLimit = 102400; // 100KiB'
const patched  = 'const defaultPayloadLimit = 10485760; // 10MiB'

let content = readFileSync(path, 'utf8')
if (content.includes(patched)) {
  console.log('milliparsec: already patched (10MiB)')
} else if (content.includes(original)) {
  writeFileSync(path, content.replace(original, patched))
  console.log('milliparsec: patched payload limit → 10MiB')
} else {
  console.error('milliparsec: could not find default limit constant — patch skipped')
}
