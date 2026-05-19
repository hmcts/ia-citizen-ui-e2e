import { test as baseTest, expect as baseExpect } from '@playwright/test';
import getPort from 'get-port';
import { PageFixtures, pageFixtures } from './page-objects/page.fixtures';
import { UtilsFixtures, utilsFixtures } from './utils';
import { ApiFixtures, apiFixtures } from './api-requests/api.fixtures';

// Gather all fixture types into a common type
export type CustomFixtures = PageFixtures & UtilsFixtures & ApiFixtures;

// Extend 'test' object using custom fixtures
// Test scoped fixtures are the first template parameter
// Worker scoped fixtures are the second template
export const test = baseTest.extend<CustomFixtures, { lighthousePort: number }>({
  ...pageFixtures,
  ...utilsFixtures,
  ...apiFixtures,
  // Worker scoped fixtures need to be defined separately
  lighthousePort: [
    async ({}, use) => {
      const port = await getPort();
      await use(port);
    },
    { scope: 'worker' },
  ],
});

const customExpect = baseExpect.extend({
  async toFail(assertion, options: { bugId: string }) {
    let failed = false;

    try {
      await assertion();
    } catch {
      failed = true;
    }

    if (failed) {
      test.info().annotations.push({
        type: 'bug',
        description: options.bugId,
      });

      return {
        pass: true,
        message: () => `Expected failure occurred (bug: ${options.bugId})`,
      };
    } else {
      return {
        pass: false,
        message: () => `Expected assertion to fail, but it passed (bug: ${options.bugId})`,
      };
    }
  },
});

export const expect = customExpect;
