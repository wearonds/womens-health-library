import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

test('mobile reader pages and private draft isolation', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('เข้าใจเรื่องสุขภาพ')
  await expect(page.getByText('กำลังเตรียมบทความ')).toBeVisible()
  await page.getByRole('link', { name: 'เกี่ยวกับเว็บไซต์', exact: true }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('เกี่ยวกับเว็บไซต์')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: 'test-results/about-mobile.png', fullPage: true })
  for (const path of ['/articles/uterine-fibroids', '/articles/vaginal-discharge', '/preview/uterine-fibroids']) expect((await request.get(path)).status()).toBe(404)
  const result = await request.get('/api/articles?draft=true')
  expect((await result.json()).docs).toEqual([])
})

test('authenticated mobile preview and editorial publication', async ({ page, context }) => {
  const credentials = readFileSync('.local/admin-login.txt', 'utf8')
  const email = credentials.match(/^Email: (.+)$/m)![1]
  const password = credentials.match(/^Password: (.+)$/m)![1]
  const login = await context.request.post('/api/users/login', { data: { email, password } })
  expect(login.ok()).toBeTruthy()
  await page.goto('/preview/uterine-fibroids')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('เนื้องอกมดลูก')
  await expect(page.getByText('ตัวอย่างสำหรับทีมงาน')).toBeVisible()
  await page.getByRole('link', { name: 'แนวทางรักษา', exact: true }).click()
  await expect(page).toHaveURL(/#section-/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: 'test-results/article-mobile.png', fullPage: true })
  await page.goto('/preview/vaginal-discharge')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ตกขาว')
  await expect(page.getByRole('heading', { name: 'ตกขาวคืออะไร และแบบใดอาจเป็นปกติ', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: 'test-results/discharge-mobile.png', fullPage: true })
  await page.goto('/admin/collections/articles')
  await expect(page.getByText('เนื้องอกมดลูก', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('ตกขาว', { exact: true }).first()).toBeVisible()

  // Publish only a temporary nonmedical fixture; never approve the starter articles.
  const slug = `browser-test-${Date.now()}`
  const created = await context.request.post('/api/articles?draft=true', { data: { title: 'บทความทดสอบระบบ', slug, description: 'ข้อมูลทดสอบ ไม่ใช่คำแนะนำทางการแพทย์', summary: [{ text: 'ทดสอบการแสดงผล' }], urgentSymptoms: 'ข้อความทดสอบ', sections: [{ heading: 'หัวข้อทดสอบ', body: 'เนื้อหาสำหรับทดสอบระบบเท่านั้น' }], references: [{ title: 'Test source', url: 'https://example.com' }], workflow: 'draft' } })
  expect(created.ok()).toBeTruthy()
  const id = (await created.json()).doc.id
  try {
    const approved = await context.request.patch(`/api/articles/${id}?draft=true`, { data: { workflow: 'approved' } })
    expect(approved.ok()).toBeTruthy()
    const published = await context.request.patch(`/api/articles/${id}`, { data: { workflow: 'published', _status: 'published' } })
    expect(published.ok()).toBeTruthy()
    await context.clearCookies()
    await page.goto(`/articles/${slug}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('บทความทดสอบระบบ')
    await expect(page.getByText('ตรวจทานโดย ผู้ดูแลระบบทดสอบ')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  } finally {
    await context.request.post('/api/users/login', { data: { email, password } })
    expect((await context.request.delete(`/api/articles/${id}`)).ok()).toBeTruthy()
  }
})
