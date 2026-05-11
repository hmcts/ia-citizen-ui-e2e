import { CommonConfig, ProjectsConfig } from '@hmcts/playwright-common';
import { defineConfig,devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...CommonConfig.recommended,
  testDir: './playwright-e2e/',
  snapshotDir: './playwright-e2e/snapshots',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  timeout: 180_000,
  workers: Number(process.env.WORKERS) || 4,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
  use: {
    ...CommonConfig.recommended.use,
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: 'global.setup.ts',
    },
    {
      name: 'teardown',
      testMatch: 'global.teardown.ts',
    },
    {
      ...ProjectsConfig.chromium,
      dependencies: ['setup'],
    },
     {
      name: 'chrome',
      dependencies: ['setup'],  
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        javaScriptEnabled: true,
        viewport: { width: 1920, height: 1080 },
        headless: true
      },
    },
     {
      name: 'firefox',
      dependencies: ['setup'],  
      use: {
        ...devices['Desktop Firefox'],
        channel: 'firefox',
        javaScriptEnabled: true,
        viewport: { width: 1920, height: 1080 },
        headless: true
      },
    },
     {
      name: 'webkit',
      dependencies: ['setup'],  
      use: {
        ...devices['Desktop Safari'],
        channel: 'webkit',
        javaScriptEnabled: true,
        viewport: { width: 1920, height: 1080 },
        headless: true
      },
    }, 
    {
      name: 'edge',
      dependencies: ['setup'],  
      use: {
        ...devices['Desktop Edge'],
        channel: 'edge',
        javaScriptEnabled: true,
        viewport: { width: 1920, height: 1080 },
        headless: true
      },
    }
  ],
});
