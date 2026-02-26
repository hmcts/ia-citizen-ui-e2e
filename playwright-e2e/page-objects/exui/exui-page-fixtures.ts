import { CaseOverviewPage } from './pages';
import { ExuiPages } from './exui-pages';
import { PageFixtures } from '../page.fixtures';

export interface ExuiPageFixtures {
  exui_pages: ExuiPages;
  exui_caseOverviewPage: CaseOverviewPage;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const exuiPageFixtures = {
  exui_pages: async ({ determinePage }: PageFixtures, use) => {
    const exui_pages = new ExuiPages(determinePage);
    await use(exui_pages);
  },
};
