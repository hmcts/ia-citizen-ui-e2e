import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { SignLanguagesType } from '../../../../../citizen-types';

export class HearingInterpreterSignLanguageSelectionPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-interpreter-sign-language-selection"])');

  public readonly $inputs = {
    manuallyEnterSignLanguageInput: this.pageForm.locator('input[name="languageManualEntryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
    selectSignLanguageDropdown: this.pageForm.locator('select[name="languageRefData"]'),
    enterLanguageManuallyCheckbox: this.pageForm.locator('input[name="languageManualEntry"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { name: 'Tell us about your sign language requirements', level: 1, exact: true }),
    weWillProvideASignLanguageInterpreterText: this.pageForm.getByText('We will provide a sign language interpreter'),
    selectSignLanguageLabel: this.pageForm.locator('label[for="languageRefData"]'),
    orText: this.pageForm.getByText('Or', { exact: true }),
    enterLanguageManuallyLabel: this.$interactive.enterLanguageManuallyCheckbox.locator('+ label'),
    manuallyEnteredSignLanguageLabel: this.pageForm.locator('label[for="languageManualEntryDescription"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-interpreter-sign-language-selection', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.weWillProvideASignLanguageInterpreterText).toHaveText(
        'We will provide a sign language interpreter for you to understand spoken communication.',
      ),
      expect(this.$static.weWillProvideASignLanguageInterpreterText).toBeVisible(),

      expect(this.$static.selectSignLanguageLabel).toHaveText('Select sign language'),
      expect(this.$static.selectSignLanguageLabel).toBeVisible(),

      expect(this.$static.orText).toBeVisible(),

      expect(this.$static.enterLanguageManuallyLabel).toHaveText('Enter the language manually'),
      expect(this.$static.enterLanguageManuallyLabel).toBeVisible(),

      expect(this.$static.manuallyEnteredSignLanguageLabel).toBeHidden(),
    ]);
  }

  public async completePageAndContinue(options: {
    languageToInterpretPreference: 'Select sign language from dropdown' | 'Enter sign language manualy';
    selectSignLanguageFromDropdown?: SignLanguagesType;
    enterSignLanguageManually?: string;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    switch (options.languageToInterpretPreference) {
      case 'Select sign language from dropdown':
        if (!options.selectSignLanguageFromDropdown) {
          throw new Error(
            'selectSignLanguageFromDropdown option must be provided when languageToInterpretPreference is "Select sign language from dropdown"',
          );
        }
        await this.$interactive.selectSignLanguageDropdown.selectOption({ label: options.selectSignLanguageFromDropdown });
        const selectedOption = await this.$interactive.selectSignLanguageDropdown.locator('option:checked').textContent();
        expect(selectedOption?.trim()).toBe(options.selectSignLanguageFromDropdown);
        break;
      case 'Enter sign language manualy':
        if (!options.enterSignLanguageManually) {
          throw new Error('enterSignLanguageManually option must be provided when languageToInterpretPreference is "Enter sign language manualy"');
        }
        await this.$interactive.enterLanguageManuallyCheckbox.check();
        await expect(this.$interactive.enterLanguageManuallyCheckbox).toBeChecked();

        await expect(this.$static.manuallyEnteredSignLanguageLabel).toHaveText('Enter the details of the language you need to request');
        await expect(this.$static.manuallyEnteredSignLanguageLabel).toBeVisible();

        await this.$inputs.manuallyEnterSignLanguageInput.fill(options.enterSignLanguageManually);
        await expect(this.$inputs.manuallyEnterSignLanguageInput).toHaveValue(options.enterSignLanguageManually);
        return;
      default:
        throw new Error(`Invalid languageToInterpretPreference: ${options.languageToInterpretPreference}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
