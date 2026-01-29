import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class AsylumSupportPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/asylum-support"])');

  public readonly $inputs = {
    asylumSupportReferenceNumberInput: this.pageForm.locator('input[id="asylumSupportRefNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your asylum support reference number?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'asylum-support', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(option: { asylumSupportRefNumber: number }): Promise<void> {
    const refNumber = option.asylumSupportRefNumber.toString();
    await this.$inputs.asylumSupportReferenceNumberInput.fill(refNumber);
    await expect(this.$inputs.asylumSupportReferenceNumberInput).toHaveValue(refNumber);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
