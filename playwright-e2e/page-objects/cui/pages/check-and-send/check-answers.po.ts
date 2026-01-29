import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class CheckAnswersPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/check-answers"])');

  public readonly $interactive = {
    statementCheckbox: this.pageForm.locator('input[type="checkbox"][id="statement"]'),
    submitAndContinueButton: this.pageForm.locator('button[type="submit"]:has-text("Submit")'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
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
