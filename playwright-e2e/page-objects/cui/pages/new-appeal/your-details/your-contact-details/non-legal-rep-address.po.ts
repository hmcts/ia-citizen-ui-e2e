import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class NonLegalRepAddressPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    addressTextArea: this.page.locator('textarea[id="nlr-address"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: `What is your non-legal representative's address?`,
    }),
    enterAddressText: this.page.locator('label[for="nlr-address"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'non-legal-rep-address',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async completePageAndContinue(options: { nonLegalRepAddress: string }): Promise<void> {
    await expect(this.$static.enterAddressText).toHaveText(`Enter your non-legal representative's address`);
    await expect(this.$static.enterAddressText).toBeVisible();

    await this.$inputs.addressTextArea.fill(options.nonLegalRepAddress);
    await expect(this.$inputs.addressTextArea).toHaveValue(options.nonLegalRepAddress);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
