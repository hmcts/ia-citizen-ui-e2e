import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { InterpretorSupportType } from '../../../../../citizen-types';

export class HearingInterpreterTypesPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/hearing-interpreter-types"])');

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.getByRole('button', { name: 'Save and continue', exact: true }),
    spokenLanguageInterpreterCheckbox: this.pageForm.locator('input[value="spokenLanguageInterpreter"]'),
    signLanguageInterpreterCheckbox: this.pageForm.locator('input[value="signLanguageInterpreter"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.getByRole('heading', { name: 'What kind of interpreter do you need to request?', level: 1, exact: true }),
    interpreterTypeHintText: this.pageForm.locator('div[id="interpreterType-hint"]'),
    spokenLanguageInterpreterLabel: this.$interactive.spokenLanguageInterpreterCheckbox.locator('+ label'),
    spokenLanguageInterpreterHintText: this.$interactive.spokenLanguageInterpreterCheckbox.locator('+ label + div'),
    signLanguageInterpreterLabel: this.$interactive.signLanguageInterpreterCheckbox.locator('+ label'),
    signLanguageInterpreterHintText: this.$interactive.signLanguageInterpreterCheckbox.locator('+ label + div'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-interpreter-types', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.interpreterTypeHintText).toHaveText('Select all that apply'),
      expect(this.$static.interpreterTypeHintText).toBeVisible(),

      expect(this.$static.spokenLanguageInterpreterLabel).toHaveText('I need a spoken language interpreter'),
      expect(this.$static.spokenLanguageInterpreterLabel).toBeVisible(),

      expect(this.$static.spokenLanguageInterpreterHintText).toHaveText('For example, an interpreter for Urdu'),
      expect(this.$static.spokenLanguageInterpreterHintText).toBeVisible(),

      expect(this.$static.signLanguageInterpreterLabel).toHaveText('I need a sign language interpreter'),
      expect(this.$static.signLanguageInterpreterLabel).toBeVisible(),

      expect(this.$static.signLanguageInterpreterHintText).toHaveText('For example, British Sign Language (BSL)'),
      expect(this.$static.signLanguageInterpreterHintText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { typeOfInterpretor: InterpretorSupportType; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    switch (options.typeOfInterpretor) {
      case 'Spoken language interpreter':
        await this.$interactive.spokenLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.spokenLanguageInterpreterCheckbox).toBeChecked();
        break;
      case 'Sign language interpreter':
        await this.$interactive.signLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.signLanguageInterpreterCheckbox).toBeChecked();
        break;
      case 'Spoken and sign language interpretor':
        await this.$interactive.spokenLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.spokenLanguageInterpreterCheckbox).toBeChecked();

        await this.$interactive.signLanguageInterpreterCheckbox.check();
        await expect(this.$interactive.signLanguageInterpreterCheckbox).toBeChecked();
        break;
      default:
        throw new Error(`Invalid type of interpretor: ${options.typeOfInterpretor}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
