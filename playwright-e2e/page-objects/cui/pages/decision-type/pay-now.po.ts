import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { payForAppealNowOrLaterType } from '../../../../types';

export class PayNowPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/pay-now"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Do you want to pay for the appeal now?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPayNowPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('pay-now')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { payNowOrLater: payForAppealNowOrLaterType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.payNowOrLater}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
