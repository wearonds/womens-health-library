import { readFile, writeFile, mkdir, mkdtemp, access, rm, rename, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { renderToStaticMarkup } from 'react-dom/server'
import { HomeView } from '../src/components/HomeView'
import { AboutView } from '../src/components/AboutView'
import { ArticleView } from '../src/components/ArticleView'
import { RecoveryDemo } from '../src/components/RecoveryDemo'
import { articleIllustrations } from '../src/components/ArticleIllustration'
import { SiteFrame } from '../src/components/SiteFrame'
import { validateSnapshot } from '../src/static/snapshot'
import type { StaticSnapshot } from '../src/static/types'
import type { ReactNode } from 'react'

const { values } = parseArgs({ options: { preview: { type: 'boolean' }, release: { type: 'boolean' }, input: { type: 'string' }, output: { type: 'string' } } })
const preview = Boolean(values.preview)
const release = Boolean(values.release)
if (preview && release) throw new Error('Preview cannot be a release candidate')
const input = values.input ?? (preview ? '.local/static-preview.json' : 'content/static-site.json')
const destination = path.resolve(values.output ?? (preview ? '.local/static-preview' : 'out'))
const relativeDestination = path.relative(process.cwd(), destination)
if (relativeDestination !== 'out' && !/^\.local\/static-[a-zA-Z0-9_-]+$/.test(relativeDestination)) throw new Error('Output must be out/ or a dedicated .local/static-* directory')
if (preview && relativeDestination === 'out') throw new Error('Draft previews cannot be written to the release directory')
const rawBasePath = process.env.STATIC_BASE_PATH ?? ''
const basePath = rawBasePath === '/' ? '' : rawBasePath.replace(/\/$/, '')
if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath)) throw new Error('Invalid STATIC_BASE_PATH')
const siteURL = process.env.STATIC_SITE_URL ? new URL(process.env.STATIC_SITE_URL) : null
if (siteURL && siteURL.protocol !== 'https:') throw new Error('STATIC_SITE_URL must use HTTPS')
const sourceBytes = await readFile(input)
const importedSnapshot = JSON.parse(sourceBytes.toString('utf8')) as StaticSnapshot
// Editorial-only content remains in the CMS; it must not enter a public build.
const excludedArticles = preview ? [] : importedSnapshot.articles.filter(article => article.reviewCategory !== 'medical')
const snapshot: StaticSnapshot = preview ? importedSnapshot : { ...importedSnapshot, articles: importedSnapshot.articles.filter(article => article.reviewCategory === 'medical') }
if (release && excludedArticles.length) throw new Error('Release blocked: snapshot contains editorial-only articles')
if (release && (!siteURL || !/^[a-f0-9]{40}$/.test(process.env.RELEASE_SOURCE_SHA ?? ''))) throw new Error('Release requires HTTPS STATIC_SITE_URL and exact RELEASE_SOURCE_SHA')
if (release && snapshot.articles.length === 0) throw new Error('Release blocked: no medically reviewed articles; withdrawal requires separate Owner approval')
if (release) {
  let checkedOutSha: string
  try { checkedOutSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() }
  catch { throw new Error('Release blocked: cannot verify checked-out source SHA') }
  if (checkedOutSha !== process.env.RELEASE_SOURCE_SHA) throw new Error('Release source SHA does not match checked-out commit')
}
validateSnapshot(snapshot, preview ? 'preview' : 'public')
const generator = 'womens-health-library-static-v1'
try {
  await access(destination)
  const existing = JSON.parse(await readFile(path.join(destination, 'static-manifest.json'), 'utf8'))
  if (existing.generator !== generator) throw new Error('Refusing to replace an unmanaged directory')
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  // An existing directory without a marker is not ours to replace.
  try { await access(destination); throw new Error('Output directory exists without a static manifest') }
  catch (nested) { if ((nested as NodeJS.ErrnoException).code !== 'ENOENT') throw nested }
}
await mkdir('.local', { recursive: true })
const staging = await mkdtemp(path.join('.local', 'static-build-'))
const pages: string[] = []
const indexedPages: string[] = []
const expectedFiles = new Set<string>()
const routeURL = (route: string) => `${basePath}${route === '/' ? '/' : route.replace(/\/$/, '') + '/'}`
const xmlEscape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!)
try {
  async function page(route: string, title: string, description: string, children: ReactNode, noIndex = preview) {
    const canonical = siteURL ? new URL(routeURL(route), siteURL.origin).toString() : undefined
    const html = '<!doctype html>' + renderToStaticMarkup(
      <html lang="th"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#14324f" /><title>{`${title} | ${snapshot.site.name}`}</title><meta name="description" content={description} /><meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} /><link rel="stylesheet" href={`${basePath}/assets/styles.css`} />{canonical && !noIndex && <link rel="canonical" href={canonical} />}</head><body><SiteFrame settings={snapshot.site} preview={preview}>{children}</SiteFrame></body></html>
    )
    // Next Link becomes ordinary HTML. Resolve its root links for project Pages.
    const withPaths = html.replace(/(<a\b[^>]*\bhref=")\/(?!\/)([^"]*)(")/g, (_, prefix: string, link: string, suffix: string) => `${prefix}${routeURL('/' + link)}${suffix}`)
    const withAssets = withPaths.replace(/(<img\b[^>]*\bsrc=")\/(?!\/)([^"]*)(")/g, (_, prefix: string, asset: string, suffix: string) => `${prefix}${basePath}/${asset}${suffix}`)
    if (/<script\b/i.test(withAssets)) throw new Error('Static output unexpectedly contains executable scripts')
    const target = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`
    await mkdir(path.dirname(path.join(staging, target)), { recursive: true })
    await writeFile(path.join(staging, target), withAssets)
    pages.push(route)
    expectedFiles.add(target)
    if (!noIndex) indexedPages.push(route)
  }
  await page('/', 'อ่านทบทวนหลังพบแพทย์', snapshot.site.introduction, <HomeView settings={snapshot.site} articles={snapshot.articles} showRecoveryDemo={preview} />)
  await page('/about', 'เกี่ยวกับเว็บไซต์', snapshot.site.purpose ?? '', <AboutView settings={snapshot.site} />)
  if (preview) await page('/recovery-demo', 'ต้นแบบคู่มือหลังตัดมดลูกผ่านหน้าท้อง', 'ร่างคู่มือหลังตัดมดลูกผ่านหน้าท้องสำหรับมือถือ ยังไม่ใช่คำแนะนำสำหรับผู้ป่วย', <RecoveryDemo />, true)
  for (const article of snapshot.articles) await page(`/articles/${article.slug}`, article.title, article.description, <ArticleView article={article} />)
  const notFound = '<!doctype html>' + renderToStaticMarkup(<html lang="th"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex, nofollow" /><title>{`ไม่พบหน้า | ${snapshot.site.name}`}</title><link rel="stylesheet" href={`${basePath}/assets/styles.css`} /></head><body><main className="wrap"><h1>ไม่พบหน้าที่ต้องการ</h1><p>บทความอาจยังไม่เผยแพร่หรือถูกถอนแล้ว</p><a className="button" href={`${basePath}/`}>กลับหน้าแรก</a></main></body></html>)
  await writeFile(path.join(staging, '404.html'), notFound)
  await mkdir(path.join(staging, 'assets'))
  await writeFile(path.join(staging, 'assets/styles.css'), (await Promise.all(['styles.css', 'recovery.css'].map(file => readFile(`src/app/(public)/${file}`, 'utf8')))).join('\n'))
  const eligibleImageSlugs = new Set(snapshot.articles.map(article => article.slug))
  for (const [slug, illustration] of Object.entries(articleIllustrations)) {
    if (!preview && !eligibleImageSlugs.has(slug)) continue
    const asset = illustration.src.slice(1)
    await mkdir(path.dirname(path.join(staging, asset)), { recursive: true })
    await writeFile(path.join(staging, asset), await readFile(path.join('public', asset)))
    expectedFiles.add(asset)
  }
  await writeFile(path.join(staging, '.nojekyll'), '')
  await writeFile(path.join(staging, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n${siteURL ? `Sitemap: ${siteURL.origin}${basePath}/sitemap.xml\n` : ''}`)
  if (siteURL && !preview) await writeFile(path.join(staging, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexedPages.map(route => `<url><loc>${xmlEscape(siteURL.origin + routeURL(route))}</loc></url>`).join('')}</urlset>`)
  await writeFile(path.join(staging, 'static-manifest.json'), JSON.stringify({ generator, mode: snapshot.mode, basePath, articleCount: snapshot.articles.length, excludedUnreviewedCount: excludedArticles.length, releaseCandidate: release, pages }, null, 2) + '\n')
  for (const file of ['404.html', 'assets/styles.css', '.nojekyll', 'robots.txt', 'static-manifest.json']) expectedFiles.add(file)
  if (siteURL && !preview) expectedFiles.add('sitemap.xml')
  // Fail closed if any unexpected file enters the release tree, including hidden files.
  const emitted: string[] = []
  async function walk(directory: string, prefix = ''): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = prefix ? prefix + '/' + entry.name : entry.name
      if (entry.isDirectory()) await walk(path.join(directory, entry.name), relative)
      else if (entry.isFile()) emitted.push(relative)
      else throw new Error('Unexpected non-file asset: ' + relative)
    }
  }
  await walk(staging)
  if (emitted.length !== expectedFiles.size || emitted.some(file => !expectedFiles.has(file))) throw new Error('Static artifact contains unexpected or missing files')
  const files = await Promise.all(emitted.sort().map(async file => {
    const bytes = await readFile(path.join(staging, file))
    return { path: file, size: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }
  }))
  await writeFile(path.join(staging, 'release-files.json'), JSON.stringify({ formatVersion: 1, mode: snapshot.mode, sourceSha: process.env.RELEASE_SOURCE_SHA ?? null, inputSha256: createHash('sha256').update(sourceBytes).digest('hex'), files }, null, 2) + '\n')
  await rm(destination, { recursive: true, force: true })
  await rename(staging, destination)
  console.log(`Built ${snapshot.mode} static site: ${pages.length} pages, ${snapshot.articles.length} articles; ${relativeDestination}`)
  console.log('No database, API, login, or server is required to serve these files.')
} catch (error) { await rm(staging, { recursive: true, force: true }); throw error }
