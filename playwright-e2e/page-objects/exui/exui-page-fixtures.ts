import { CaseOverviewPage } from './pages';
import { PageFixtures } from '../page.fixtures';

export interface ExuiPageFixtures {
  exui_caseOverviewPage: CaseOverviewPage;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const exuiPageFixtures = {
  exui_caseOverviewPage: async ({ determinePage }: PageFixtures, use) => {
    const exui_caseOverviewPage = new CaseOverviewPage(determinePage);
    await use(exui_caseOverviewPage);
  },
};
