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
    asylumSupportFirstParagraph: this.pageForm.locator('fieldset[class="govuk-fieldset"] p').nth(0),
    asylumSupportSecondParagraph: this.pageForm.locator('fieldset[class="govuk-fieldset"] p').nth(1),
    asylumSupportWarningText: this.pageForm.locator('fieldset[class="govuk-fieldset"] [class="govuk-warning-text"]'),
    asylumSupportrefLabel: this.pageForm.locator('label[for="asylumSupportRefNumber"]'),
    asylumSupportDateHintText: this.pageForm.locator('div[id="asylumSupportRefNumber-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'asylum-support', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.asylumSupportFirstParagraph).toHaveText(
        'The Tribunal will check your reference number is valid after you submit your appeal.',
      ),
      expect(this.$static.asylumSupportFirstParagraph).toBeVisible(),

      expect(this.$static.asylumSupportSecondParagraph).toHaveText(
        'If you do not know your reference number, contact Migrant Help (opens in a new tab) on 0808 8010 503 or proofofsupport@migranthelpuk.org.',
      ),
      expect(this.$static.asylumSupportSecondParagraph).toBeVisible(),

      expect(this.$static.asylumSupportWarningText).toContainText('Your asylum support reference number is not your Home Office reference number'),
      expect(this.$static.asylumSupportWarningText).toBeVisible(),

      expect(this.$static.asylumSupportrefLabel).toHaveText('Enter your asylum support reference number'),
      expect(this.$static.asylumSupportrefLabel).toBeVisible(),

      expect(this.$static.asylumSupportDateHintText).toHaveText('For example, 23/02/12345'),
      expect(this.$static.asylumSupportDateHintText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { asylumSupportRefNumber: number; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const refNumber = option.asylumSupportRefNumber.toString();
    await this.$inputs.asylumSupportReferenceNumberInput.fill(refNumber);
    await expect(this.$inputs.asylumSupportReferenceNumberInput).toHaveValue(refNumber);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
