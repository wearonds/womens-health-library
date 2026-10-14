import { test } from 'node:test'
import assert from 'node:assert/strict'
import { writeFile, readFile, mkdir, rm, access } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { fingerprint } from '../src/lib/content-fingerprint'
import { validateSnapshot } from '../src/static/snapshot'
import type { StaticSnapshot, StaticArticle } from '../src/static/types'

function snapshot(): StaticSnapshot {
  const article: StaticArticle = { title: 'บทความทดสอบ', slug: 'test-article', description: 'ข้อมูลทดสอบระบบ', summary: [{ text: 'สรุปทดสอบ' }], urgentSymptoms: 'ข้อความทดสอบ', sections: [{ heading: 'หัวข้อ', body: '<script>alert(1)</script>' }], questions: null, references: [{ title: 'Reference', url: 'https://example.com' }], reviewCategory: 'editorial', reviewerName: 'ผู้ตรวจทานทดสอบ', reviewedAt: '2026-10-14T00:00:00Z', publication: { status: 'published', workflow: 'published', approvedFingerprint: null } }
  article.publication.approvedFingerprint = fingerprint(article as unknown as Record<string, unknown>)
  return { formatVersion: 1, mode: 'public', site: { name: 'เว็บทดสอบ', introduction: 'อ่านทบทวน', purpose: 'ทดสอบ', scope: 'ข้อมูลทดสอบ', reviewProcess: 'ตรวจทาน', team: 'ทีมทดสอบ' }, articles: [article] }
}

test('release validation rejects draft, changed content, wrong mode and unsafe references', () => {
  validateSnapshot(snapshot(), 'public')
  const draft = snapshot(); draft.articles[0].publication.status = 'draft'
  assert.throws(() => validateSnapshot(draft, 'public'), /unapproved/)
  const changed = snapshot(); changed.articles[0].description = 'changed after approval'
  assert.throws(() => validateSnapshot(changed, 'public'), /changed/)
  const preview = snapshot(); preview.mode = 'preview'
  assert.throws(() => validateSnapshot(preview, 'public'), /wrong export mode/)
  const unsafe = snapshot(); unsafe.articles[0].references![0].url = 'javascript:alert(1)'
  assert.throws(() => validateSnapshot(unsafe, 'public'), /HTTPS/)
})

test('standalone project Pages build works without DB credentials and removes withdrawn pages', async () => {
  const suffix = randomBytes(6).toString('hex')
  const input = `.local/static-test-${suffix}.json`
  const output = `.local/static-test-${suffix}`
  const fixture = snapshot()
  const env: NodeJS.ProcessEnv = { ...process.env, STATIC_BASE_PATH: '/womens-health-library', STATIC_SITE_URL: 'https://example.com' }
  delete env.DATABASE_URL; delete env.PAYLOAD_SECRET
  const run = () => spawnSync(process.execPath, ['--import', 'tsx', 'scripts/build-static.tsx', '--input', input, '--output', output], { env, encoding: 'utf8' })
  await mkdir('.local', { recursive: true })
  try {
    await writeFile(input, JSON.stringify(fixture))
    const result = run(); assert.equal(result.status, 0, result.stderr)
    const home = await readFile(`${output}/index.html`, 'utf8')
    assert.match(home, /href="\/womens-health-library\/articles\/test-article\/"/)
    assert.match(home, /href="\/womens-health-library\/assets\/styles.css"/)
    const article = await readFile(`${output}/articles/test-article/index.html`, 'utf8')
    assert.match(article, /&lt;script&gt;alert/)
    assert.doesNotMatch(article, /<script\b|\/api\/|\/admin/)
    assert.match(await readFile(`${output}/sitemap.xml`, 'utf8'), /https:\/\/example.com\/womens-health-library\/articles\/test-article\//)
    fixture.articles = []
    await writeFile(input, JSON.stringify(fixture))
    const rebuilt = run(); assert.equal(rebuilt.status, 0, rebuilt.stderr)
    await assert.rejects(() => access(`${output}/articles/test-article/index.html`))
    assert.equal(JSON.parse(await readFile(`${output}/static-manifest.json`, 'utf8')).articleCount, 0)
  } finally { await rm(input, { force: true }); await rm(output, { recursive: true, force: true }) }
})

test('preview exporter cannot replace the release directory', () => {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/build-static.tsx', '--preview', '--output', 'out'], { encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Draft previews cannot/)
})
