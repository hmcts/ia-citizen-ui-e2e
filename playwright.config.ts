import { CommonConfig, ProjectsConfig } from '@hmcts/playwright-common';
import { defineConfig } from '@playwright/test';
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
  ],
});
