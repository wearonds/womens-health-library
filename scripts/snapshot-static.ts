import nextEnv from '@next/env'
import { mkdir, writeFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { publicSettings, snapshotArticle, validateSnapshot } from '../src/static/snapshot'
import type { StaticSnapshot } from '../src/static/types'
nextEnv.loadEnvConfig(process.cwd())
const preview = process.argv.includes('--preview')
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const snapshot: StaticSnapshot = { formatVersion: 1, mode: preview ? 'preview' : 'public', site: publicSettings(await payload.findGlobal({ slug: 'site-settings', overrideAccess: false })), articles: [] }
  let page = 1
  while (true) {
    // Trusted local export reads the approval fingerprint, but never exports users,
    // relationships, tokens, account data, or internal CMS fields.
    const result = await payload.find({ collection: 'articles', overrideAccess: true, draft: preview, depth: 0, page, limit: 100, where: preview ? undefined : { and: [{ _status: { equals: 'published' } }, { workflow: { equals: 'published' } }] }, sort: 'slug' })
    snapshot.articles.push(...result.docs.map(snapshotArticle))
    if (!result.hasNextPage) break
    page++
  }
  validateSnapshot(snapshot, snapshot.mode)
  const file = preview ? '.local/static-preview.json' : 'content/static-site.json'
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(`${file}.tmp`, JSON.stringify(snapshot, null, 2) + '\n')
  await rename(`${file}.tmp`, file)
  console.log(`Saved ${snapshot.mode} snapshot: ${snapshot.articles.length} articles; ${file}`)
} finally { await payload.destroy() }
process.exit(0)
