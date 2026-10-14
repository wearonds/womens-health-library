import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/browser', workers: 1, fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:3000', viewport: { width: 390, height: 844 }, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined } },
  webServer: { command: 'npm run start', url: 'http://127.0.0.1:3000/about', reuseExistingServer: !process.env.CI, timeout: 60_000 },
})
