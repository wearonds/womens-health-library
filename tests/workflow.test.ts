import { test } from 'node:test'
import assert from 'node:assert/strict'
import nextEnv from '@next/env'
import { randomBytes } from 'node:crypto'
nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')

test('medical workflow: permissions, approval invalidation, public isolation, withdrawal', async () => {
  const payload = await getPayload({ config })
  const suffix = randomBytes(6).toString('hex')
  const users: any[] = []
  let articleID: number | undefined
  try {
    for (const role of ['author', 'reviewer', 'publisher', 'admin'] as const) users.push(await payload.create({ collection: 'users', data: { email: `${role}-${suffix}@localhost.invalid`, password: randomBytes(24).toString('hex'), name: `Test ${role}`, role }, user: { id: 0, collection: 'users', role: 'admin' } as any }))
    const [author, reviewer, publisher, owner] = users
    const article = await payload.create({ collection: 'articles', overrideAccess: false, user: author, draft: true, data: { title: 'Test article', slug: `test-${suffix}`, description: 'Test only', summary: [{ text: 'Test summary' }], urgentSymptoms: 'Test warning', sections: [{ heading: 'Test section', body: 'Original body' }], references: [{ title: 'Test source', url: 'https://example.com/reference' }], workflow: 'draft' } })
    articleID = article.id
    const update = (user: any, data: any, draft = true) => payload.update({ collection: 'articles', id: article.id, overrideAccess: false, user, draft, data })
    const publicDocs = () => payload.find({ collection: 'articles', overrideAccess: false, draft: false, where: { id: { equals: article.id } }, depth: 0 })
    assert.equal((await publicDocs()).totalDocs, 0, 'draft must be private')
    await assert.rejects(() => update(author, { workflow: 'approved' }), /เฉพาะผู้ตรวจทาน/)
    await assert.rejects(() => update(author, { _status: 'published', workflow: 'published' }, false), /ไม่มีสิทธิ์/)
    await assert.rejects(() => update(publisher, { _status: 'published', workflow: 'published' }, false), /ต้องผ่านการตรวจทาน/)
    await update(reviewer, { workflow: 'approved' })
    assert.equal((await payload.findByID({ collection: 'articles', id: article.id, draft: true })).reviewCategory, 'medical')
    await update(author, { sections: [{ heading: 'Test section', body: 'Changed after approval' }] })
    await assert.rejects(() => update(publisher, { _status: 'published', workflow: 'published' }, false), /ต้องผ่านการตรวจทาน/)
    await update(reviewer, { workflow: 'approved' })
    await update(publisher, { workflow: 'published', _status: 'published' }, false)
    assert.equal((await publicDocs()).totalDocs, 1)
    const publicDoc = (await publicDocs()).docs[0]
    assert.equal(publicDoc.reviewerName, reviewer.name)
    assert.equal(publicDoc.approvedFingerprint, undefined)
    assert.equal(publicDoc.reviewedBy, undefined)
    await update(author, { sections: [{ heading: 'Test section', body: 'Private revision' }], workflow: 'draft', _status: 'draft' })
    assert.equal((await publicDocs()).docs[0].sections?.[0].body, 'Changed after approval', 'public version must remain unchanged')
    const anonymousDraftQuery = await payload.find({ collection: 'articles', overrideAccess: false, draft: true, where: { id: { equals: article.id } } })
    assert.ok(!JSON.stringify(anonymousDraftQuery.docs).includes('Private revision'), 'draft=true must not expose draft to anonymous users')
    await assert.rejects(() => update(publisher, { workflow: 'published', _status: 'published' }, false), /ต้องผ่านการตรวจทาน/)
    const unchanged = await payload.update({ collection: 'users', id: author.id, user: author, overrideAccess: false, data: { role: 'admin' } })
    assert.equal(unchanged.role, 'author', 'self-edit must not escalate permissions')
    await update(publisher, { workflow: 'draft', _status: 'draft' }, false)
    assert.equal((await publicDocs()).totalDocs, 0, 'withdrawal must remove public article')
    await update(owner, { workflow: 'approved' })
    const spoofed = await update(author, { reviewCategory: 'medical', reviewerName: 'Fake doctor' })
    assert.equal(spoofed.reviewCategory, 'editorial', 'author cannot forge a medical review')
    assert.equal(spoofed.reviewerName, owner.name)
    await update(owner, { workflow: 'published', _status: 'published' }, false)
    assert.equal((await publicDocs()).docs[0].reviewCategory, 'editorial')
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    if (articleID) await payload.delete({ collection: 'articles', id: articleID })
    for (const user of users) await payload.delete({ collection: 'users', id: user.id })
    await payload.destroy()
  }
})
