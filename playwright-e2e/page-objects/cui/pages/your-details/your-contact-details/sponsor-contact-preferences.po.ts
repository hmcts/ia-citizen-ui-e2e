import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class SponsorContactPreferencesPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/sponsor-contact-preferences"])');

  public readonly $inputs = {
    emailInput: this.pageForm.locator('input[id="email-value"]'),
    phoneNumberInput: this.pageForm.locator('input[id="text-message-value"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    emailCheckbox: this.pageForm.locator('input[type="checkbox"][value="email"]'),
    mobilePhoneCheckbox: this.pageForm.locator('input[type="checkbox"][value="text-message"]'),
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: `What are your sponsor's contact details?`,
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'sponsor-contact-preferences', pageHeading: this.$static.pageHeading });
  }

  /**
   *
   * @param options - contactPreference: 'Email' | 'Phone' | 'Email and Phone'
   *                  applicantEmail - required if contactPreference is 'Email' or 'Email and Phone'
   *                  applicationPhoneNumber - required if contactPreference is 'Phone' or 'Email and Phone'
   */
  public async completePageAndContinue(options: {
    contactPreference: 'Email' | 'Phone' | 'Email and Phone';
    sponsorEmail?: string;
    sponsorPhoneNumber?: string;
  }): Promise<void> {
    const fillEmail = async (email: string) => {
      await this.$interactive.emailCheckbox.check();
      await expect(this.$interactive.emailCheckbox).toBeChecked();

      await expect(this.$inputs.emailInput).toBeVisible();
      await this.$inputs.emailInput.fill(email);
      await expect(this.$inputs.emailInput).toHaveValue(email);
    };

    const fillPhone = async (phoneNumber: string) => {
      await this.$interactive.mobilePhoneCheckbox.check();
      await expect(this.$interactive.mobilePhoneCheckbox).toBeChecked();

      const phone = phoneNumber.toString();
      await expect(this.$inputs.phoneNumberInput).toBeVisible();
      await this.$inputs.phoneNumberInput.fill(phone);
      await expect(this.$inputs.phoneNumberInput).toHaveValue(phone);
    };

    switch (options.contactPreference) {
      case 'Email':
        if (!options.sponsorEmail) {
          throw new Error('applicantEmail is required when contactPreference is Email');
        }
        await fillEmail(options.sponsorEmail);
        break;

      case 'Phone':
        if (!options.sponsorPhoneNumber) {
          throw new Error('applicationPhoneNumber is required when contactPreference is Phone');
        }
        await fillPhone(options.sponsorPhoneNumber);
        break;

      case 'Email and Phone':
        if (!options.sponsorEmail || !options.sponsorPhoneNumber) {
          throw new Error('Both applicantEmail and applicationPhoneNumber are required when contactPreference is Email and Phone');
        }
        await fillEmail(options.sponsorEmail);
        await fillPhone(options.sponsorPhoneNumber);
        break;

      default:
        throw new Error('Invalid contact preference option');
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
