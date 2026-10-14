import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/static-browser', workers: 1,
  use: { viewport: { width: 390, height: 844 }, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined } },
  webServer: [
    { command: 'node scripts/serve-static.mjs --directory .local/static-preview --port 4173', url: 'http://127.0.0.1:4173/womens-health-library/', reuseExistingServer: false },
    { command: 'node scripts/serve-static.mjs --directory out --port 4174', url: 'http://127.0.0.1:4174/womens-health-library/', reuseExistingServer: false },
  ],
})
