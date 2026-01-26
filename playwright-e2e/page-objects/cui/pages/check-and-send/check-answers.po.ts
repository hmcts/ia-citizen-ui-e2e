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

  public async verifyUserIsOnCheckAnswersPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('check-answers')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async submitApplication(): Promise<void> {
    await this.$interactive.statementCheckbox.check();
    await expect(this.$interactive.statementCheckbox).toBeChecked();
    await this.navigationClick(this.$interactive.submitAndContinueButton);
  }
}
