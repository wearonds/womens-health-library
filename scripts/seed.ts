import nextEnv from '@next/env'
import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import vaginalDischarge from '../content/articles/vaginal-discharge.json'
nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
try {
  let admin = (await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1 })).docs[0]
  if (!admin) {
    const password = randomBytes(24).toString('base64url')
    admin = await payload.create({ collection: 'users', data: { email: 'admin@localhost.invalid', password, name: 'ผู้จัดทำคลังความรู้สุขภาพสตรี', role: 'admin' } })
    await mkdir('.local', { recursive: true, mode: 0o700 })
    await writeFile('.local/admin-login.txt', `Local development only\nEmail: admin@localhost.invalid\nPassword: ${password}\n`, { mode: 0o600, flag: 'wx' })
    console.log('Local administrator created. Credentials are in ignored .local/admin-login.txt (not printed).')
  }
  const articles = [
    { title: 'เนื้องอกมดลูก', slug: 'uterine-fibroids', description: 'ทำความเข้าใจอาการ การตรวจ แนวทางรักษา และการติดตามหลังพบแพทย์', summary: [{ text: 'หลายคนไม่มีอาการ และไม่จำเป็นต้องรักษาทุกราย' }, { text: 'การรักษาขึ้นกับอาการ ขนาด ตำแหน่งก้อน และความต้องการมีบุตร' }], urgentSymptoms: 'เลือดออกมากจนหน้ามืด ใจสั่น หรือเป็นลม\nปวดท้องน้อยรุนแรงเฉียบพลัน\nอ่อนเพลียมากหรือมีอาการผิดปกติที่น่ากังวล', sections: [{ heading: 'เนื้องอกมดลูกคืออะไร', body: 'เนื้องอกที่เกิดจากกล้ามเนื้อมดลูก โดยส่วนใหญ่เป็นเนื้องอกชนิดไม่ร้าย หลายคนไม่มีอาการ และไม่จำเป็นต้องรักษาทุกราย' }, { heading: 'อาการที่อาจพบ', body: 'ประจำเดือนมามากหรือนาน\nปวดหรือรู้สึกแน่นท้องน้อย\nปัสสาวะบ่อยจากการกดเบียด\nบางรายไม่มีอาการเลย' }, { heading: 'ตรวจอย่างไร', body: 'แพทย์ซักประวัติ ตรวจร่างกาย และอาจใช้อัลตราซาวด์เพื่อประเมินขนาด จำนวน และตำแหน่งของก้อน' }, { heading: 'แนวทางรักษา', body: 'ติดตามอาการและขนาดก้อน\nใช้ยาเพื่อควบคุมอาการบางอย่าง\nหัตถการหรือผ่าตัดเมื่อมีข้อบ่งชี้\nแนวทางที่เหมาะสมแตกต่างกันในแต่ละคน' }], questions: [{ text: 'ก้อนอยู่ตำแหน่งไหน และต้องติดตามเมื่อไร?' }, { text: 'มีผลต่อการมีบุตรหรือไม่?' }, { text: 'อาการแบบใดที่ต้องกลับมาพบแพทย์ก่อนนัด?' }], references: [{ title: 'ACOG — Uterine Fibroids', url: 'https://www.acog.org/womens-health/faqs/uterine-fibroids' }] },
    vaginalDischarge,
  ]
  for (const article of articles) {
    const existing = await payload.find({ collection: 'articles', where: { slug: { equals: article.slug } }, limit: 1, draft: true })
    if (!existing.docs.length) { await payload.create({ collection: 'articles', user: admin, draft: true, data: { ...article, workflow: 'draft', _status: 'draft' } }); console.log(`Created draft: ${article.slug}`) }
    else console.log(`Preserved existing article: ${article.slug}`)
  }
} finally { await payload.destroy() }

// Payload 3.90 PostgreSQL adapter retains a health connection after destroy.
// Exit only after all awaited seed operations have completed successfully.
process.exit(0)
