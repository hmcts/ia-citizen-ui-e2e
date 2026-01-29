import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { FeeSupportType } from '../../../../types';

export class FeeSupportPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/fee-support"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Do you have to pay the fee?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'fee-support', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { whetherApplicantHasToPayAFee: FeeSupportType }): Promise<void> {
    const element = this.pageForm
      .locator('div[class*="radios__item"]', { hasText: option.whetherApplicantHasToPayAFee })
      .locator('input[type="radio"]');

    await element.check();
    await expect(element).toBeChecked();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
