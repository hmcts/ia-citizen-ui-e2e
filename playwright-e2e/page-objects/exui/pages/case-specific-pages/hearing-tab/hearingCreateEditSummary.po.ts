import { ExuiBase } from '../../../exui-base';
import { Locator, Page } from '@playwright/test';

export class HearingCreateEditSummaryPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    submitRequestButton: this.page.getByRole('button', { name: 'Submit request', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Check your answers before sending your request', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'hearing-create-edit-summary',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async submitRequest(): Promise<void> {
    await this.navigationClick(this.$interactive.submitRequestButton);
  }
}
