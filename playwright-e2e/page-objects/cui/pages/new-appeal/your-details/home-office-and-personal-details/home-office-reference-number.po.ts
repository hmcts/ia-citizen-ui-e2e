import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class HomeOfficeReferenceNumberPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    referenceNumber: this.page.locator('input[name="homeOfficeRefNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'What is your Home Office reference number?',
    }),
    howToFindReferenceHeading: this.page.getByRole('heading', { level: 2, name: 'reference number' }),
    howToFindInstructionOne: this.page.locator('ul[class*="govuk-list"] li').nth(0),
    howToFindInstructionTwo: this.page.locator('ul[class*="govuk-list"] li').nth(1),
    howToFindInstructionThree: this.page.locator('ul[class*="govuk-list"] li').nth(2),
    howToFindInstructionFour: this.page.locator('ul[class*="govuk-list"] li').nth(3),
    homeOfficeContactDetails: this.page.getByText('Call the Home Office on'),
    enterReferenceLabel: this.page.locator('label[for="homeOfficeRefNumber"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'home-office-reference-number', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.howToFindReferenceHeading).toHaveText('How to find your Office reference number'),
      expect(this.$static.howToFindReferenceHeading).toBeVisible(),

      expect(this.$static.howToFindInstructionOne).toHaveText(
        'Your Home Office reference number is usually on the first page of your Home Office decision letter',
      ),
      expect(this.$static.howToFindInstructionOne).toBeVisible(),

      expect(this.$static.howToFindInstructionTwo).toHaveText(
        'It is usually either 9 numbers or 16 numbers with dashes, for example 123456789 or 1234-1234-1234-1234',
      ),
      expect(this.$static.howToFindInstructionTwo).toBeVisible(),

      expect(this.$static.howToFindInstructionThree).toHaveText(
        'If your letter includes a reference with 8 numbers, like 98765432, add 0 to the start and enter that number, for example 098765432',
      ),
      expect(this.$static.howToFindInstructionThree).toBeVisible(),

      expect(this.$static.howToFindInstructionFour).toHaveText('Do not enter any reference that includes a letter, for example A246893521'),
      expect(this.$static.howToFindInstructionFour).toBeVisible(),

      expect(this.$static.homeOfficeContactDetails).toHaveText(
        'Call the Home Office on +44 (0)161 877 5919 (9am-3pm, Monday to Friday) if you cannot find the correct number.',
      ),
      expect(this.$static.homeOfficeContactDetails).toBeVisible(),

      expect(this.$static.enterReferenceLabel).toHaveText('Enter your Home Office reference number'),
      expect(this.$static.enterReferenceLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { homeOfficeReference: number; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const homeOfficeReference = option.homeOfficeReference.toString();

    await this.$inputs.referenceNumber.fill(homeOfficeReference);
    await expect(this.$inputs.referenceNumber).toHaveValue(homeOfficeReference);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
