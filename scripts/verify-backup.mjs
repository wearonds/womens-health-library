import { realpathSync, readFileSync, openSync, closeSync } from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import assert from 'node:assert/strict'
import { docker, createFixture, dropFixture, tableDigests, sha256 } from './local-operations.mjs'

if (!process.argv[2]) throw new Error('Usage: npm run backup:verify -- .local/backups/<backup-directory>')
const directory = realpathSync(process.argv[2])
const root = realpathSync('.local/backups')
if (!directory.startsWith(root + path.sep)) throw new Error('Only locally generated backup directories are supported')
const manifest = JSON.parse(readFileSync(path.join(directory, 'manifest.json'), 'utf8'))
if (manifest.formatVersion !== 1 || manifest.source !== 'local-compose-library') throw new Error('Unsupported backup format')
for (const [file, digest] of Object.entries(manifest.files)) {
  if (!['database.dump', 'media.tar.gz'].includes(file)) throw new Error('Unexpected backup file')
  assert.equal(sha256(path.join(directory, file)), digest, `Archive checksum mismatch: ${file}`)
}
assert.ok(manifest.files['database.dump'], 'Database archive is required')
const fixture = `library_restore_check_${randomBytes(6).toString('hex')}`
createFixture(fixture)
try {
  const fd = openSync(path.join(directory, 'database.dump'), 'r')
  try { docker(['exec', '-T', 'database', 'pg_restore', '-U', 'library', '-d', fixture, '--no-owner', '--exit-on-error'], { stdio: [fd, 'pipe', 'pipe'] }) }
  finally { closeSync(fd) }
  assert.deepEqual(tableDigests(fixture), manifest.tables, 'Restored table counts/content differ from manifest (source may have changed during backup)')
  console.log(`PASS: restored ${Object.keys(manifest.tables).length} tables in an isolated database; every row digest matches`)
  if (manifest.includesMedia) console.log('Media archive SHA-256 verified; media extraction is not exercised by this database check')
} finally { dropFixture(fixture) }
console.log('Temporary restore database removed. Active database was not modified.')
