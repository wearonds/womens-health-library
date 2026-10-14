import nextEnv from '@next/env'
import draft from '../content/articles/vaginal-discharge.json'
import { fingerprint } from '../src/lib/workflow'
nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  const admin = (await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1 })).docs[0]
  if (!admin) throw new Error('Run npm run seed first to prepare a local administrator')
  const existing = (await payload.find({ collection: 'articles', where: { slug: { equals: draft.slug } }, draft: true, limit: 1 })).docs[0]
  if (!existing) {
    await payload.create({ collection: 'articles', user: admin, draft: true, data: { ...draft, workflow: 'draft', _status: 'draft' } })
    console.log('Created vaginal-discharge draft')
  } else if (fingerprint(existing as unknown as Record<string, unknown>) === fingerprint(draft)) {
    console.log('Draft content already matches; no changes made')
  } else {
    const untouchedPlaceholder = existing.title === 'ตกขาว' && existing.description === 'ร่างสำหรับจัดทำเนื้อหาและตรวจทาน ยังไม่พร้อมเผยแพร่' && !existing.sections?.length && !existing.summary?.length && !existing.references?.length && !existing.questions?.length && !existing.urgentSymptoms && existing.workflow === 'draft' && existing._status === 'draft' && !existing.reviewedAt
    if (!untouchedPlaceholder) throw new Error('Existing article has edits. Preserving it; import requires an editorial merge.')
    await payload.update({ collection: 'articles', id: existing.id, user: admin, draft: true, data: { ...draft, workflow: 'draft', _status: 'draft' } })
    console.log('Filled untouched placeholder; kept as unapproved draft')
  }
  const saved = (await payload.find({ collection: 'articles', where: { slug: { equals: draft.slug } }, draft: true, limit: 1 })).docs[0]
  if (!saved || fingerprint(saved as unknown as Record<string, unknown>) !== fingerprint(draft) || saved._status !== 'draft' || saved.workflow !== 'draft' || saved.reviewedAt) throw new Error('Draft verification failed')
  const publicResult = await payload.find({ collection: 'articles', where: { slug: { equals: draft.slug } }, overrideAccess: false, draft: false })
  if (publicResult.totalDocs) throw new Error('Starter draft unexpectedly visible to the public')
  console.log(`Verified private, unapproved draft: ${saved.sections?.length} sections, ${saved.references?.length} proposed references`)
} finally { await payload.destroy() }
process.exit(0)
