import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { Nationality } from '../../../../../citizen-types';

export class ApplicantNationalityPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/nationality"])');

  public readonly $interactive = {
    nationalityDropdown: this.pageForm.locator('select[name="nationality"]'),
    isStatelessCheckbox: this.pageForm.locator('input[value="isStateless"]'),
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1 label', {
      hasText: 'What is your nationality?',
    }),
    statelessLabel: this.pageForm.locator('label[for="stateless"]'),
    statelessHint: this.pageForm.locator('div[id="stateless-item-hint"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'nationality', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    const defaultDropDownText = await this.$interactive.nationalityDropdown.locator('option:checked').textContent();
    await Promise.all([
      expect(defaultDropDownText?.trim()).toBe('Please select a nationality'),

      expect(this.$static.statelessLabel).toHaveText('I do not have a nationality'),
      expect(this.$static.statelessLabel).toBeVisible(),

      expect(this.$static.statelessHint).toHaveText('This is known as being stateless. You can still appeal if you do not have a nationality.'),
      expect(this.$static.statelessHint).toBeVisible(),
    ]);
  }

  /**
   * Completes the Applicant Nationality page and continues to the next page.
   * @param options - Object containing stateless boolean and nationality string
   * If stateless is false, nationality must be provided.
   */
  public async completePageAndContinue(options: { stateless: boolean; nationality?: Nationality; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    if (!options.stateless) {
      if (!options.nationality) {
        throw new Error('Nationality must be provided when stateless is false.');
      }
      await this.$interactive.nationalityDropdown.selectOption({ label: options.nationality });
      const selectedOption = await this.$interactive.nationalityDropdown.locator('option:checked').textContent();
      expect(selectedOption?.trim()).toBe(options.nationality);
    } else {
      await this.$interactive.isStatelessCheckbox.check();
      await expect(this.$interactive.isStatelessCheckbox).toBeChecked();
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
