import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { AllMaleOrFemaleHearingType } from '../../../../../citizen-types';

export class HearingSingleSexTypePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-single-sex-type"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { name: 'What type of hearing will you need?', level: 1, exact: true }),
    allMaleLabel: this.pageForm.locator('input[type="radio"][value="yes"] + label'),
    allFemaleLabel: this.pageForm.locator('input[type="radio"][value="no"] + label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-single-sex-type', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.allMaleLabel).toHaveText('All male'),
      expect(this.$static.allMaleLabel).toBeVisible(),

      expect(this.$static.allFemaleLabel).toHaveText('All female'),
      expect(this.$static.allFemaleLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(option: { typeOfHearing: AllMaleOrFemaleHearingType; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const answerValue = option.typeOfHearing === 'All male' ? 'yes' : 'no';

    const element = this.pageForm.locator(`input[type="radio"][value="${answerValue}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
