import { Page, Locator } from '@playwright/test';
import { ExuiBase } from '../exui-base';
import { config } from '../../../utils';

export class CaseOverviewPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {} as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 2, name: 'Current progress of the case', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: '#Overview', pageHeading: this.$static.pageHeading, timeout: 30_000 });
  }

  public async goTo(options: { caseId: string }): Promise<void> {
    await this.page.goto(`${config.urls.exuiDefaultUrl}cases/case-details/IA/Asylum/${options.caseId}#Overview`);
    await this.verifyUserIsOnPage();
  }
}
