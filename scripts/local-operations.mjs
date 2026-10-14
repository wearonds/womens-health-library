import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// Always use the managed local daemon; retain proxy and registry configuration.
const dockerEnv = { ...process.env }
for (const name of ['DOCKER_HOST', 'DOCKER_CONTEXT', 'DOCKER_TLS', 'DOCKER_TLS_VERIFY', 'DOCKER_CERT_PATH']) delete dockerEnv[name]
export function docker(args, options = {}) {
  const result = spawnSync('docker', ['--host=unix:///var/run/docker.sock', 'compose', ...args], { env: dockerEnv, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, ...options })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Local database operation failed: ${result.stderr || `exit ${result.status}`}`)
  return result.stdout
}
export function sql(database, query) {
  return docker(['exec', '-T', 'database', 'psql', '-X', '-v', 'ON_ERROR_STOP=1', '-U', 'library', '-d', database, '-A', '-t', '-c', query]).trim()
}
export function validateFixtureName(name) {
  if (!/^library_(restore|migration)_check_[a-f0-9]{12}$/.test(name)) throw new Error('Refusing to operate on a non-fixture database')
}
export function createFixture(name) {
  validateFixtureName(name)
  sql('postgres', `CREATE DATABASE "${name}"`)
}
export function dropFixture(name) {
  validateFixtureName(name)
  sql('postgres', `DROP DATABASE "${name}" WITH (FORCE)`)
}
export function tableDigests(database) {
  const names = sql(database, "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename").split('\n').filter(Boolean)
  return Object.fromEntries(names.map(name => {
    if (!/^[a-z0-9_]+$/.test(name)) throw new Error('Unexpected table identifier')
    // Only return counts and digests, never the stored account data.
    const result = sql(database, `SELECT count(*), md5(COALESCE(string_agg(row_to_json(t)::text, E'\\n' ORDER BY row_to_json(t)::text), '')) FROM public."${name}" t`).split('|')
    return [name, { rows: Number(result[0]), digest: result[1] }]
  }))
}
export const sha256 = file => createHash('sha256').update(readFileSync(file)).digest('hex')
