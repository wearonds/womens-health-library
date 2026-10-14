import nextEnv from '@next/env'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { fingerprint } from '../src/lib/workflow'
import type { Article } from '../src/payload-types'

nextEnv.loadEnvConfig(process.cwd())
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

function clinicalContent(article: Article) {
  return {
    title: article.title,
    slug: article.slug,
    description: article.description,
    summary: article.summary?.map(({ text }) => ({ text })) ?? [],
    urgentSymptoms: article.urgentSymptoms ?? '',
    sections: article.sections?.map(({ heading, body }) => ({ heading, body })) ?? [],
    questions: article.questions?.map(({ text }) => ({ text })) ?? [],
    references: article.references?.map(({ title, url }) => ({ title, url })) ?? [],
  }
}

const escapeHTML = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
const thaiTime = (timestamp: string) => new Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'long', timeStyle: 'short' }).format(new Date(timestamp)) + ' (เวลาไทย)'
const paragraph = (value: string) => `<p class="body">${escapeHTML(value)}</p>`
const list = (items: { text: string }[]) => `<ul>${items.map(item => `<li>${escapeHTML(item.text)}</li>`).join('')}</ul>`

try {
  const admin = (await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1 })).docs[0]
  if (!admin) throw new Error('Run npm run seed first')
  const articles: Article[] = []
  for (const slug of ['uterine-fibroids', 'vaginal-discharge']) {
    const article = (await payload.find({ collection: 'articles', user: admin, overrideAccess: false, draft: true, where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
    if (!article?.sections?.length) throw new Error(`Missing draft content: ${slug}`)
    articles.push(article)
  }
  const snapshots = articles.map(article => ({
    articleID: article.id,
    updatedAt: article.updatedAt,
    workflow: article.workflow,
    publicationStatus: article._status,
    // Hash the full CMS content so approval can be checked against this exact revision.
    contentFingerprint: fingerprint(article as unknown as Record<string, unknown>),
    content: clinicalContent(article),
  }))
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  await mkdir('.local/review', { recursive: true })
  // A new directory preserves any notes or annotations in earlier exports.
  const directory = await mkdtemp(path.join('.local/review', `${date}-`))
  await writeFile(path.join(directory, 'snapshots.json'), JSON.stringify(snapshots, null, 2) + '\n')
  const guide = [
    '# ชุดบทความสำหรับแพทย์ตรวจทาน', '',
    `ส่งออกวันที่ ${date} (เวลาไทย) จากร่างล่าสุดใน CMS`, '',
    'เอกสารนี้เป็นชุดส่งตรวจ ไม่ใช่การอนุมัติหรือการเผยแพร่บทความ ผู้จัดทำไม่ได้เติมชื่อแพทย์หรือวันที่อนุมัติ', '',
    '## วิธีใช้', '',
    '1. ตรวจความถูกต้อง ความเหมาะสมกับผู้ป่วย และคำแนะนำอาการเร่งด่วนของแต่ละบทความ',
    '2. เปิดแหล่งอ้างอิงเพื่อยืนยันข้อมูลและความเป็นปัจจุบัน ลิงก์ NHS/CDC ยังไม่ได้ตรวจจากเว็บไซต์จริงเพราะข้อจำกัดเครือข่าย ส่วน ACOG เป็นลิงก์ที่มีในต้นแบบและยังไม่ได้ตรวจสอบในการจัดชุดนี้',
    '3. ระบุข้อความที่ต้องแก้พร้อมหัวข้อ ไม่ต้องใส่ข้อมูลผู้ป่วย',
    '4. นำข้อแก้ไขกลับเข้า CMS และส่งออกใหม่หากเนื้อหาเปลี่ยน',
    '5. ผู้ตรวจทานอนุมัติใน CMS หลังตรวจเนื้อหาเวอร์ชันสุดท้ายจริง จากนั้นผู้มีสิทธิ์จึงเผยแพร่', '',
    'ไฟล์ snapshots.json ระบุเนื้อหา เวลาแก้ไข และรหัสตรวจสอบของเวอร์ชันที่ส่งตรวจ เพื่อไม่ให้สับสนกับเวอร์ชันที่แก้ภายหลัง', '',
    '## บทความในชุดนี้', '',
    ...snapshots.map(snapshot => `- [${snapshot.content.title}](${snapshot.content.slug}.md) — สถานะ ${snapshot.workflow} / ${snapshot.publicationStatus}`), '',
  ].join('\n')
  await writeFile(path.join(directory, 'README.md'), guide)
  const articleHTML: string[] = []
  for (const snapshot of snapshots) {
    const article = snapshot.content
    const markdown = [
      `# ${article.title} — ฉบับส่งตรวจ`, '',
      `สถานะใน CMS: ${snapshot.workflow} / ${snapshot.publicationStatus}`, '',
      `แก้ไขล่าสุด: ${thaiTime(snapshot.updatedAt)}`, '',
      `รหัสตรวจสอบเนื้อหา: ${snapshot.contentFingerprint}`, '',
      '> แหล่งอ้างอิงยังต้องตรวจสอบก่อนอนุมัติ ไม่มีการอนุมัติหรือเผยแพร่จากการส่งออกเอกสารนี้', '',
      article.description, '', '## สรุปสิ่งที่ควรรู้', '',
      ...article.summary.map(item => `- ${item.text}`), '',
      '## อาการที่ควรรีบพบแพทย์', '', article.urgentSymptoms, '',
      ...article.sections.flatMap(section => [`## ${section.heading}`, '', section.body, '']),
      '## คำถามสำหรับการพบแพทย์ครั้งหน้า', '',
      ...article.questions.map(item => `- ${item.text}`), '',
      '## แหล่งอ้างอิงที่รอตรวจสอบ', '',
      ...article.references.map(reference => `- [${reference.title}](${reference.url})`), '',
      '## ความเห็นผู้ตรวจทาน', '',
      'ผู้ตรวจทาน: ____________________  วันที่: ____________________', '',
      'ผลการตรวจ: ☐ ต้องแก้ไข  ☐ พร้อมให้นำเวอร์ชันนี้ไปตรวจยืนยันและอนุมัติใน CMS', '',
      'หัวข้อ / ข้อความที่ต้องแก้ไข: ________________________________________', '',
      'คำแนะนำการติดตามหรือการติดต่อคลินิกที่ควรเพิ่ม: ________________________', '',
    ].join('\n')
    await writeFile(path.join(directory, `${article.slug}.md`), markdown)
    articleHTML.push(`<article><h1>${escapeHTML(article.title)}</h1><p class="status">ฉบับส่งตรวจ · สถานะ ${escapeHTML(snapshot.workflow ?? '')} / ${escapeHTML(snapshot.publicationStatus ?? '')}</p><p class="small">แก้ไขล่าสุด ${escapeHTML(thaiTime(snapshot.updatedAt))}<br>รหัสตรวจสอบ ${snapshot.contentFingerprint}</p>${paragraph(article.description)}<h2>สรุปสิ่งที่ควรรู้</h2>${list(article.summary)}<section class="warning"><h2>อาการที่ควรรีบพบแพทย์</h2>${paragraph(article.urgentSymptoms)}</section>${article.sections.map(section => `<h2>${escapeHTML(section.heading)}</h2>${paragraph(section.body)}`).join('')}<h2>คำถามสำหรับการพบแพทย์ครั้งหน้า</h2>${list(article.questions)}<h2>แหล่งอ้างอิงที่รอตรวจสอบ</h2><ul>${article.references.map(reference => `<li><a href="${escapeHTML(reference.url)}">${escapeHTML(reference.title)}</a><br><span class="small">${escapeHTML(reference.url)}</span></li>`).join('')}</ul><section class="review-form"><h2>ความเห็นผู้ตรวจทาน: ${escapeHTML(article.title)}</h2><p class="small">รหัสตรวจสอบเนื้อหา ${snapshot.contentFingerprint}</p><p>ผู้ตรวจทาน __________________ วันที่ __________________</p><p>☐ ต้องแก้ไข<br>☐ พร้อมให้นำเวอร์ชันนี้ไปตรวจยืนยันและอนุมัติใน CMS</p><p>หัวข้อ / ข้อความที่ต้องแก้ไข</p><div class="lines"></div><p>คำแนะนำการติดตามหรือการติดต่อคลินิกที่ควรเพิ่ม</p><div class="lines"></div></section></article>`)
  }
  const html = `<!doctype html><html lang="th"><meta charset="utf-8"><title>ชุดบทความสำหรับแพทย์ตรวจทาน</title><style>@page{size:A4;margin:18mm}body{font-family:system-ui,"Noto Sans Thai",sans-serif;color:#24212b;font-size:15px;line-height:1.8}h1{font-size:26px}h2{font-size:19px;margin-top:24px;break-after:avoid}.body{white-space:pre-line}.small{font-size:11px;overflow-wrap:anywhere;color:#514a59}.status{font-weight:700}.warning{border-left:3px solid #a73561;padding:8px 14px;background:#fff6f6}article{break-before:page}li{margin-block:6px}a{color:#763247;overflow-wrap:anywhere}.review-form{break-before:page}.lines{height:100px;background:repeating-linear-gradient(white,white 31px,#ccc 32px,white 33px)}footer{font-size:12px}</style><body><h1>ชุดบทความสำหรับแพทย์ตรวจทาน</h1><p>คลังความรู้สุขภาพสตรี · ส่งออกวันที่ ${date} (เวลาไทย)</p><p>บทความเนื้องอกมดลูก และบทความตกขาว</p><h2>วิธีใช้ชุดเอกสาร</h2><ol><li>ตรวจความถูกต้องของเนื้อหา ภาษาสำหรับผู้ป่วย และคำแนะนำอาการเร่งด่วน</li><li>เปิดแหล่งอ้างอิงและยืนยันข้อมูลล่าสุด แหล่งอ้างอิงในชุดนี้ยังต้องตรวจสอบ</li><li>ระบุข้อความที่ต้องแก้พร้อมหัวข้อ โดยไม่ใส่ข้อมูลผู้ป่วย</li><li>นำข้อแก้ไขกลับเข้า CMS หากเนื้อหาเปลี่ยนให้ส่งออกชุดใหม่</li><li>อนุมัติใน CMS หลังตรวจเวอร์ชันสุดท้ายจริง ก่อนผู้มีสิทธิ์เผยแพร่</li></ol><p>เว็บไซต์ NHS/CDC ยังไม่ได้ตรวจจากเว็บไซต์จริงเนื่องจากข้อจำกัดเครือข่าย ส่วนลิงก์ ACOG มาจากต้นแบบและยังไม่ได้ตรวจสอบในการจัดชุดนี้</p><p>เอกสารนี้ไม่มีการอนุมัติอัตโนมัติ และไม่มีการเติมชื่อผู้ตรวจทานหรือวันที่อนุมัติ</p>${articleHTML.join('')}<footer>ข้อมูลทั่วไปสำหรับอ่านทบทวนหลังพบแพทย์ · ฉบับส่งตรวจ</footer></body></html>`
  await writeFile(path.join(directory, 'review-pack.html'), html)
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined })
  try {
    const page = await browser.newPage()
    await page.setContent(html)
    await page.evaluate(() => document.fonts.ready)
    await page.pdf({ path: path.join(directory, 'review-pack.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:9px;width:100%;text-align:center">ฉบับส่งตรวจ · หน้า <span class="pageNumber"></span> / <span class="totalPages"></span></div>' })
  } finally { await browser.close() }
  console.log(`Review pack exported: ${directory}/review-pack.pdf`)
  console.log('Read-only CMS export; no approval, publication, or account changes.')
} finally { await payload.destroy() }
process.exit(0)
