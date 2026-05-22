import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { LanguagesType } from '../../../../../citizen-types';

export class HearingInterpreterSpokenLanguageSelectionPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-interpreter-spoken-language-selection"])');

  public readonly $inputs = {
    manuallyEnterLanguageInput: this.pageForm.locator('input[name="languageManualEntryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
    selectLanguageDropdown: this.pageForm.locator('select[name="languageRefData"]'),
    enterLanguageManuallyCheckbox: this.pageForm.locator('input[name="languageManualEntry"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { name: 'Tell us about your language requirements', level: 1, exact: true }),
    weWillProvideAnInterpreterText: this.pageForm.getByText('We will provide an interpreter'),
    selectLanguageLabel: this.pageForm.locator('label[for="languageRefData"]'),
    orText: this.pageForm.getByText('Or', { exact: true }),
    enterLanguageManuallyLabel: this.$interactive.enterLanguageManuallyCheckbox.locator('+ label'),
    manuallyEnteredLanguageLabel: this.pageForm.locator('label[for="languageManualEntryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-interpreter-spoken-language-selection', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.weWillProvideAnInterpreterText).toHaveText('We will provide an interpreter for you to understand spoken communication.'),
      expect(this.$static.weWillProvideAnInterpreterText).toBeVisible(),

      expect(this.$static.selectLanguageLabel).toHaveText('Select language'),
      expect(this.$static.selectLanguageLabel).toBeVisible(),

      expect(this.$static.orText).toBeVisible(),

      expect(this.$static.enterLanguageManuallyLabel).toHaveText('Enter the language manually'),
      expect(this.$static.enterLanguageManuallyLabel).toBeVisible(),

      expect(this.$static.manuallyEnteredLanguageLabel).toBeHidden(),
    ]);
  }

  public async completePageAndContinue(options: {
    languageToInterpretPreference: 'Select language from dropdown' | 'Enter language manualy';
    selectLanguageFromDropdown?: LanguagesType;
    enterLanguageManually?: string;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    switch (options.languageToInterpretPreference) {
      case 'Select language from dropdown':
        if (!options.selectLanguageFromDropdown) {
          throw new Error('selectLanguageFromDropdown option must be provided when languageToInterpretPreference is "Select language from dropdown"');
        }
        await this.$interactive.selectLanguageDropdown.selectOption({ label: options.selectLanguageFromDropdown });
        const selectedOption = await this.$interactive.selectLanguageDropdown.locator('option:checked').textContent();
        expect(selectedOption?.trim()).toBe(options.selectLanguageFromDropdown);
        break;
      case 'Enter language manualy':
        if (!options.enterLanguageManually) {
          throw new Error('enterLanguageManually option must be provided when languageToInterpretPreference is "Enter language manualy"');
        }
        await this.$interactive.enterLanguageManuallyCheckbox.check();
        await expect(this.$interactive.enterLanguageManuallyCheckbox).toBeChecked();

        await expect(this.$static.manuallyEnteredLanguageLabel).toHaveText('Enter the details of the language you need to request');
        await expect(this.$static.manuallyEnteredLanguageLabel).toBeVisible();

        await this.$inputs.manuallyEnterLanguageInput.fill(options.enterLanguageManually);
        await expect(this.$inputs.manuallyEnterLanguageInput).toHaveValue(options.enterLanguageManually);
        return;
      default:
        throw new Error(`Invalid languageToInterpretPreference: ${options.languageToInterpretPreference}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
