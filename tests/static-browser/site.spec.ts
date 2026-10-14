import { test, expect } from '@playwright/test'
const project = '/womens-health-library'
const preview = `http://127.0.0.1:4173${project}`
const release = `http://127.0.0.1:4174${project}`

test('all four static preview pages work on mobile with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  try {
    await page.goto(preview + '/')
    await expect(page.getByText('ตัวอย่างเว็บไซต์ · สำหรับตรวจรูปแบบ')).toBeVisible()
    await expect(page.getByRole('link', { name: /เนื้องอกมดลูก.*อ่านบทความ/ })).toBeVisible()
    await page.screenshot({ path: 'test-results/static-home-mobile.png', fullPage: true })
    for (const [slug, title] of [['uterine-fibroids', 'เนื้องอกมดลูก'], ['vaginal-discharge', 'ตกขาว']]) {
      await page.goto(`${preview}/articles/${slug}/`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
      await expect(page.locator('script')).toHaveCount(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
      const diagram = page.locator('.article-illustration img')
      await diagram.scrollIntoViewIfNeeded()
      await expect(diagram).toBeVisible()
      await diagram.evaluate((img: HTMLImageElement) => img.decode())
      expect(await diagram.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy()
      await expect(diagram).toHaveAttribute('src', `${project}/illustrations/${slug}.png`)
      const firstTopic = page.locator('.contents a').first()
      await firstTopic.click()
      await expect(page).toHaveURL(/#section-0$/)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
      await page.getByRole('link', { name: 'กลับไปเลือกบทความ' }).click()
      await expect(page).toHaveURL(preview + '/')
    }
    await page.getByRole('link', { name: 'เกี่ยวกับเว็บไซต์', exact: true }).first().click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('เกี่ยวกับเว็บไซต์')
    expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontSize)).toBe('17px')
  } finally { await context.close() }
})

test('release excludes unapproved articles, CMS routes and credential files', async ({ request }) => {
  const home = await request.get(release + '/')
  expect(home.status()).toBe(200)
  expect(await home.text()).toContain('เนื้องอกมดลูก')
  for (const slug of ['uterine-fibroids', 'vaginal-discharge']) {
    const response = await request.get(`${release}/articles/${slug}/`)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('ยังไม่ได้ผ่านการตรวจทานทางการแพทย์')
    expect(await response.text()).not.toContain('ตรวจทานทางการแพทย์โดย')
  }
  for (const route of ['/admin/', '/api/articles/', '/.env', '/.local/admin-login.txt', '/content/articles/vaginal-discharge.json']) expect((await request.get(release + route)).status()).toBe(404)
  for (const slug of ['uterine-fibroids', 'vaginal-discharge']) {
    const illustration = await request.get(`${release}/illustrations/${slug}.png`)
    expect(illustration.status()).toBe(200)
    expect(illustration.headers()['content-type']).toContain('image/png')
  }
  const styles = await request.get(release + '/assets/styles.css')
  expect(styles.status()).toBe(200)
  expect(styles.headers()['content-type']).toContain('text/css')
  const sitemap = await request.get(release + '/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain('uterine-fibroids')
})
