import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class ApplicantAddressPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/address"])');

  public readonly $inputs = {
    postcode: this.pageForm.locator('input[id="postcode"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    enterAddressManuallyLink: this.pageForm.locator('a[href="/manual-address"]'),
    findAddressButton: this.pageForm.locator('button', {
      hasText: 'Find address',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your address?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'address', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(options: {
    addressPreference: 'Post Code Search' | 'Enter Address Manually';
    postCode?: string;
  }): Promise<void> {
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
