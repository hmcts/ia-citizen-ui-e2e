import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

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
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnOutOfCountryAddressPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('out-of-country-address')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { applicantAddress: string }): Promise<void> {
    await this.$inputs.addressTextArea.fill(option.applicantAddress);
    await expect(this.$inputs.addressTextArea).toHaveValue(option.applicantAddress);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
