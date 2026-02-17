import { Page } from '@playwright/test';
import { IdamSignInPage } from './idam-sign-in-page.po';
import { CuiPageFixtures, cuiPageFixtures } from './cui/cui-page-fixtures';
import { ExuiPageFixtures, exuiPageFixtures } from './exui/exui-page-fixtures';

export type PageFixtures = CuiPageFixtures &
  ExuiPageFixtures & {
    determinePage: Page;
    idam_signInPage: IdamSignInPage;
  };

export const pageFixtures = {
  ...cuiPageFixtures,
  ...exuiPageFixtures,
  // If a performance test is executed, use the lighthouse created page instead
  determinePage: async ({ page, lighthousePage }, use, testInfo) => {
    if (testInfo.tags.includes('@performance')) {
      await use(lighthousePage);
    } else {
      await use(page);
    }
  },
  idam_signInPage: async ({ determinePage }: PageFixtures, use) => {
    const idam_signInPage = new IdamSignInPage(determinePage);
    await use(idam_signInPage);
  },
};
