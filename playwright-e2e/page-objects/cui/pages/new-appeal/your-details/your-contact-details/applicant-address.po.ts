import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class ApplicantAddressPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    postcode: this.page.locator('input[id="postcode"]'),
    enterAddressManuallyLink: this.page.getByRole('link', { name: 'I want to enter my address manually', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    enterAddressManuallyLink: this.page.locator('a[href="/manual-address"]'),
    findAddressButton: this.page.locator('button', {
      hasText: 'Find address',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'What is your address?',
    }),
    enterPostCodeLabel: this.page.locator('label[for="postcode"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'address', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.enterPostCodeLabel).toHaveText('Enter a UK postcode'),
      expect(this.$static.enterPostCodeLabel).toBeVisible(),

      expect(this.$interactive.enterAddressManuallyLink).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    addressPreference: 'Post Code Search' | 'Enter Address Manually';
    postCode?: string;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    switch (options.addressPreference) {
      case 'Enter Address Manually':
        await this.navigationClick(this.$interactive.enterAddressManuallyLink);
        break;

      case 'Post Code Search':
        if (!options.postCode) {
          throw new Error('postCode is required when addressPreference is Post Code Search');
        }
        await this.$inputs.postcode.fill(options.postCode!);
        await expect(this.$inputs.postcode).toHaveValue(options.postCode!);
        await this.navigationClick(this.$interactive.findAddressButton);
        break;

      default:
        throw new Error(`Unknown address preference: ${options.addressPreference}`);
    }
  }
}
