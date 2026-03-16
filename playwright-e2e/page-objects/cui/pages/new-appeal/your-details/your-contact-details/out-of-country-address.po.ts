import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class OutOfCountryAddressPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/out-of-country-address"])');

  public readonly $inputs = {
    addressTextArea: this.pageForm.locator('textarea[id="outofcountry-address"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your address?',
    }),
    enterAddressText: this.pageForm.locator('label[for="outofcountry-address"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'out-of-country-address', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(options: { applicantAddress: string; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await Promise.all([
        expect(this.$static.enterAddressText).toHaveText('Enter your address'),
        expect(this.$static.enterAddressText).toBeVisible(),
      ]);
    }

    await this.$inputs.addressTextArea.fill(options.applicantAddress);
    await expect(this.$inputs.addressTextArea).toHaveValue(options.applicantAddress);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
