import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { payForAppealNowOrLaterType } from '../../../../../citizen-types';

export class PayNowPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Do you want to pay for the appeal now?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'pay-now', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { payNowOrLater: payForAppealNowOrLaterType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${option.payNowOrLater}"]`);
    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
