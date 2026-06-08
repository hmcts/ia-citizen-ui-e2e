import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class NewAppealCheckAnswersPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    statementCheckbox: this.page.locator('input[type="checkbox"][id="statement"]'),
    submitAndContinueButton: this.page.locator('button[type="submit"]:has-text("Submit")'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Check your answers',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'check-answers', pageHeading: this.$static.pageHeading });
  }

  public async submitApplication(): Promise<void> {
    await this.$interactive.statementCheckbox.check();
    await expect(this.$interactive.statementCheckbox).toBeChecked();
    await this.navigationClick(this.$interactive.submitAndContinueButton);
  }
}
