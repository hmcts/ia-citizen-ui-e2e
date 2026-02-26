import { Page } from '@playwright/test';
import { CaseOverviewPage } from './pages/index';

export class ExuiPages {
  private readonly page: Page;

  public readonly caseOverviewPage: CaseOverviewPage;

  constructor(page: Page) {
    this.page = page;
    this.caseOverviewPage = new CaseOverviewPage(this.page);
  }

  /**
   * Creates a new ExuiPages instance bound to another browser context or tab.
   * Allows multi-tab testing.
   */
  public async newBrowserContext(options: { pageContext: Page }): Promise<ExuiPages> {
    return new ExuiPages(options.pageContext);
  }
}
