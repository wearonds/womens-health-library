import { readFile, writeFile, mkdir, mkdtemp, access, rm, rename } from 'node:fs/promises'
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

const { values } = parseArgs({ options: { preview: { type: 'boolean' }, input: { type: 'string' }, output: { type: 'string' } } })
const preview = Boolean(values.preview)
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
const snapshot = JSON.parse(await readFile(input, 'utf8')) as StaticSnapshot
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
const routeURL = (route: string) => `${basePath}${route === '/' ? '/' : route.replace(/\/$/, '') + '/'}`
const xmlEscape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!)
try {
  async function page(route: string, title: string, description: string, children: ReactNode, noIndex = preview) {
    const canonical = siteURL ? new URL(routeURL(route), siteURL.origin).toString() : undefined
    const html = '<!doctype html>' + renderToStaticMarkup(
      <html lang="th"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#fff7f7" /><title>{`${title} | ${snapshot.site.name}`}</title><meta name="description" content={description} /><meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} /><link rel="stylesheet" href={`${basePath}/assets/styles.css`} />{canonical && !noIndex && <link rel="canonical" href={canonical} />}</head><body><SiteFrame settings={snapshot.site} preview={preview}>{children}</SiteFrame></body></html>
    )
    // Next Link becomes ordinary HTML. Resolve its root links for project Pages.
    const withPaths = html.replace(/(<a\b[^>]*\bhref=")\/(?!\/)([^"]*)(")/g, (_, prefix: string, link: string, suffix: string) => `${prefix}${routeURL('/' + link)}${suffix}`)
    const withAssets = withPaths.replace(/(<img\b[^>]*\bsrc=")\/(?!\/)([^"]*)(")/g, (_, prefix: string, asset: string, suffix: string) => `${prefix}${basePath}/${asset}${suffix}`)
    if (/<script\b/i.test(withAssets)) throw new Error('Static output unexpectedly contains executable scripts')
    const target = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`
    await mkdir(path.dirname(path.join(staging, target)), { recursive: true })
    await writeFile(path.join(staging, target), withAssets)
    pages.push(route)
    if (!noIndex) indexedPages.push(route)
  }
  await page('/', 'อ่านทบทวนหลังพบแพทย์', snapshot.site.introduction, <HomeView settings={snapshot.site} articles={snapshot.articles} />)
  await page('/about', 'เกี่ยวกับเว็บไซต์', snapshot.site.purpose ?? '', <AboutView settings={snapshot.site} />)
  await page('/recovery-demo', 'ต้นแบบคู่มือหลังผ่าตัดมดลูก', 'ตัวอย่างคู่มือหลังผ่าตัดมดลูกสำหรับมือถือ ยังไม่ใช่คำแนะนำสำหรับผู้ป่วย', <RecoveryDemo />, true)
  for (const article of snapshot.articles) await page(`/articles/${article.slug}`, article.title, article.description, <ArticleView article={article} />)
  const notFound = '<!doctype html>' + renderToStaticMarkup(<html lang="th"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex, nofollow" /><title>{`ไม่พบหน้า | ${snapshot.site.name}`}</title><link rel="stylesheet" href={`${basePath}/assets/styles.css`} /></head><body><main className="wrap"><h1>ไม่พบหน้าที่ต้องการ</h1><p>บทความอาจยังไม่เผยแพร่หรือถูกถอนแล้ว</p><a className="button" href={`${basePath}/`}>กลับหน้าแรก</a></main></body></html>)
  await writeFile(path.join(staging, '404.html'), notFound)
  await mkdir(path.join(staging, 'assets'))
  await writeFile(path.join(staging, 'assets/styles.css'), (await Promise.all(['styles.css', 'recovery.css'].map(file => readFile(`src/app/(public)/${file}`, 'utf8')))).join('\n'))
  for (const illustration of Object.values(articleIllustrations)) {
    const asset = illustration.src.slice(1)
    await mkdir(path.dirname(path.join(staging, asset)), { recursive: true })
    await writeFile(path.join(staging, asset), await readFile(path.join('public', asset)))
  }
  await writeFile(path.join(staging, '.nojekyll'), '')
  await writeFile(path.join(staging, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n${siteURL ? `Sitemap: ${siteURL.origin}${basePath}/sitemap.xml\n` : ''}`)
  if (siteURL && !preview) await writeFile(path.join(staging, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexedPages.map(route => `<url><loc>${xmlEscape(siteURL.origin + routeURL(route))}</loc></url>`).join('')}</urlset>`)
  await writeFile(path.join(staging, 'static-manifest.json'), JSON.stringify({ generator, mode: snapshot.mode, basePath, articleCount: snapshot.articles.length, pages }, null, 2) + '\n')
  await rm(destination, { recursive: true, force: true })
  await rename(staging, destination)
  console.log(`Built ${snapshot.mode} static site: ${pages.length} pages, ${snapshot.articles.length} articles; ${relativeDestination}`)
  console.log('No database, API, login, or server is required to serve these files.')
} catch (error) { await rm(staging, { recursive: true, force: true }); throw error }
