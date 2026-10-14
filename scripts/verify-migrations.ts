import nextEnv from '@next/env'
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { createFixture, dropFixture, sql } from './local-operations.mjs'
nextEnv.loadEnvConfig(process.cwd())
if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL')
const original = new URL(process.env.DATABASE_URL)
if (!['127.0.0.1', 'localhost'].includes(original.hostname) || original.port !== '5433' || original.pathname !== '/library') throw new Error('Migration check only supports this project’s local Compose database')
const fixture = `library_migration_check_${randomBytes(6).toString('hex')}`
const fixtureURL = new URL(original)
fixtureURL.pathname = `/${fixture}`
createFixture(fixture)
try {
  const run = () => {
    const result = spawnSync(process.execPath, ['node_modules/payload/bin.js', 'migrate'], { env: { ...process.env, DATABASE_URL: fixtureURL.toString(), NODE_ENV: 'production' }, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 60_000 })
    if (result.error) throw result.error
    // Do not emit command arguments or connection strings.
    if (result.status !== 0) throw new Error(`Migration command failed with exit ${result.status}`)
  }
  run()
  assert.equal(sql(fixture, "SELECT count(*) FROM payload_migrations WHERE name LIKE '%initial_schema'"), '1')
  assert.equal(sql(fixture, "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('users','articles','_articles_v','media','site_settings')"), '5')
  run()
  assert.equal(sql(fixture, "SELECT count(*) FROM payload_migrations WHERE name LIKE '%initial_schema'"), '1')
  console.log('PASS: initial schema applied to an empty database; second migration run applied no duplicate migration')
} finally { dropFixture(fixture) }
console.log('Temporary migration database removed. Active database was not modified.')
