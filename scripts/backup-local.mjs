import { mkdirSync, mkdtempSync, openSync, closeSync, writeFileSync, existsSync, lstatSync, readdirSync, chmodSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { docker, tableDigests, sha256 } from './local-operations.mjs'

mkdirSync('.local/backups', { recursive: true, mode: 0o700 })
const directory = mkdtempSync(path.join('.local/backups', 'backup-'))
chmodSync(directory, 0o700)
const dumpPath = path.join(directory, 'database.dump')
const fd = openSync(dumpPath, 'wx', 0o600)
try {
  docker(['exec', '-T', 'database', 'pg_dump', '-U', 'library', '-d', 'library', '--format=custom'], { stdio: ['ignore', fd, 'pipe'] })
} finally { closeSync(fd) }
const files = { 'database.dump': sha256(dumpPath) }
if (existsSync('media')) {
  function rejectLinks(dir) {
    if (lstatSync(dir).isSymbolicLink()) throw new Error('Media symlinks are not supported by local backup')
    if (lstatSync(dir).isDirectory()) for (const entry of readdirSync(dir)) rejectLinks(path.join(dir, entry))
  }
  rejectLinks('media')
  const result = spawnSync('tar', ['-czf', path.join(directory, 'media.tar.gz'), 'media'], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error('Media archive creation failed')
  chmodSync(path.join(directory, 'media.tar.gz'), 0o600)
  files['media.tar.gz'] = sha256(path.join(directory, 'media.tar.gz'))
}
const manifest = { formatVersion: 1, createdAt: new Date().toISOString(), source: 'local-compose-library', files, tables: tableDigests('library'), includesMedia: Boolean(files['media.tar.gz']) }
writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600, flag: 'wx' })
console.log(`Local backup created: ${directory}`)
console.log(`Tables: ${Object.keys(manifest.tables).length}; media archive: ${manifest.includesMedia ? 'included' : 'no local media directory'}`)
console.log('Database dump contains account records. Keep this ignored directory private.')
