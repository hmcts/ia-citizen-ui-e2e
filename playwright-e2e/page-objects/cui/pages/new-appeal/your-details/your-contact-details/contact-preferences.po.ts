import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class ContactPreferencesPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/contact-preferences"])');

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
      hasText: 'How do you want us to contact you?',
    }),
    contactDetailsHintText: this.pageForm.locator('div[id="contactDetails-hint"]'),
    emailLabel: this.pageForm.locator("//input[@value='email']/following-sibling::label"),
    mobilePhoneLabel: this.pageForm.locator("//input[@value='text-message']/following-sibling::label"),
    under18Text: this.pageForm.getByText('If you are under 18'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'contact-preferences', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.contactDetailsHintText).toHaveText(
        'Select at least one of option, or both. For international numbers include the country code for the country your phone is registered in.',
      ),
      expect(this.$static.contactDetailsHintText).toBeVisible(),

      expect(this.$static.emailLabel).toHaveText('Email'),
      expect(this.$static.emailLabel).toBeVisible(),

      expect(this.$static.mobilePhoneLabel).toHaveText('Mobile phone'),
      expect(this.$static.mobilePhoneLabel).toBeVisible(),

      expect(this.$static.under18Text).toHaveText(
        'If you are under 18 years old, you can enter contact details for a parent, guardian, sponsor or other responsible adult',
      ),
      expect(this.$static.under18Text).toBeVisible(),
    ]);
  }
  /**
   *
   * @param options - contactPreference: 'Email' | 'Phone' | 'Email and Phone'
   *                  applicantEmail - required if contactPreference is 'Email' or 'Email and Phone'
   *                  applicationPhoneNumber - required if contactPreference is 'Phone' or 'Email and Phone'
   */
  public async completePageAndContinue(options: {
    contactPreference: 'Email' | 'Phone' | 'Email and Phone';
    applicantEmail?: string;
    applicantPhoneNumber?: string;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

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
        if (!options.applicantEmail) {
          throw new Error('applicantEmail is required when contactPreference is Email');
        }
        await fillEmail(options.applicantEmail);
        break;

      case 'Phone':
        if (!options.applicantPhoneNumber) {
          throw new Error('applicationPhoneNumber is required when contactPreference is Phone');
        }
        await fillPhone(options.applicantPhoneNumber);
        break;

      case 'Email and Phone':
        if (!options.applicantEmail || !options.applicantPhoneNumber) {
          throw new Error('Both applicantEmail and applicationPhoneNumber are required when contactPreference is Email and Phone');
        }
        await fillEmail(options.applicantEmail);
        await fillPhone(options.applicantPhoneNumber);
        break;

      default:
        throw new Error('Invalid contact preference option');
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
