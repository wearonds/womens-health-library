import nextEnv from '@next/env'
nextEnv.loadEnvConfig(process.cwd())
if (!process.argv.includes('--editorial')) throw new Error('Use --editorial to acknowledge owner publication without medical review')
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  let owner = (await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1 })).docs[0]
  if (!owner) throw new Error('No local owner account')
  if (owner.name === 'ผู้ดูแลระบบทดสอบ') owner = await payload.update({ collection: 'users', id: owner.id, user: owner, data: { name: 'ผู้จัดทำคลังความรู้สุขภาพสตรี' } })
  const site = await payload.findGlobal({ slug: 'site-settings' })
  const resolvedConfig = await config
  const defaults = resolvedConfig.globals?.find(global => global.slug === 'site-settings')?.fields
  const siteData: Record<string, string> = {}
  for (const field of defaults ?? []) {
    if ('name' in field && ['reviewProcess', 'team'].includes(field.name) && 'defaultValue' in field && typeof field.defaultValue === 'string') siteData[field.name] = field.defaultValue
  }
  await payload.updateGlobal({ slug: 'site-settings', user: owner, overrideAccess: false, data: { ...site, ...siteData } })
  for (const slug of ['uterine-fibroids', 'vaginal-discharge']) {
    const article = (await payload.find({ collection: 'articles', user: owner, overrideAccess: false, where: { slug: { equals: slug } }, draft: true, limit: 1 })).docs[0]
    if (!article) throw new Error(`Missing starter article: ${slug}`)
    if (article.workflow === 'published' && article._status === 'published') { console.log(`Already published: ${slug}`); continue }
    if (article.reviewCategory === 'medical') throw new Error('Preserving an existing medical review; this helper only publishes editorial starter articles')
    await payload.update({ collection: 'articles', id: article.id, user: owner, overrideAccess: false, draft: true, data: { workflow: 'approved' } })
    const published = await payload.update({ collection: 'articles', id: article.id, user: owner, overrideAccess: false, data: { workflow: 'published', _status: 'published' } })
    if (published.reviewCategory !== 'editorial') throw new Error('Unexpected approval category')
    console.log(`Owner-approved publication, medical review pending: ${slug}`)
  }
} finally { await payload.destroy() }
process.exit(0)
