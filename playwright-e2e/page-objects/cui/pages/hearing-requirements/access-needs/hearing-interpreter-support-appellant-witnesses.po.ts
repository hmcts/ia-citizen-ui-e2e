import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { WhoNeedsInterpretorType } from '../../../../../citizen-types';

export class HearingInterpreterSupportAppellantWitnessesPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    saveAndContinueButton: this.page.getByRole('button', { name: 'Save and continue', exact: true }),
    interpreterForAppellantCheckbox: this.page.locator('input[value="isInterpreterServicesNeeded"]'),
    interpreterForWitnessCheckbox: this.page.locator('input[value="isAnyWitnessInterpreterRequired"]'),
    noInterpreterSupportRequiredCheckbox: this.page.locator('input[value="noInterpreterRequired"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Who are you requesting support for?', level: 1, exact: true }),
    hintText: this.page.getByText('If you request an interpreter,'),
    hintText2: this.page.locator('div[id="interpreterSupport-hint"]'),
    interpreterForAppellantLabel: this.$interactive.interpreterForAppellantCheckbox.locator('+ label'),
    interpreterForWitnessLabel: this.$interactive.interpreterForWitnessCheckbox.locator('+ label'),
    orText: this.page.getByText('or', { exact: true }),
    noInterpreterSupportRequiredLabel: this.$interactive.noInterpreterSupportRequiredCheckbox.locator('+ label'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-interpreter-support-appellant-Witnesses', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.hintText).toHaveText(
        'If you request an interpreter, they will be provided by the court. You cannot bring your own.You will be able to request step-free access or hearing loop later.',
      ),
      expect(this.$static.hintText).toBeVisible(),

      expect(this.$static.hintText2).toHaveText('Select all that apply'),
      expect(this.$static.hintText2).toBeVisible(),

      expect(this.$static.interpreterForAppellantLabel).toHaveText('Interpreter support for me personally'),
      expect(this.$static.interpreterForAppellantLabel).toBeVisible(),

      expect(this.$static.interpreterForWitnessLabel).toHaveText('Interpreter support for one or more witnesses'),
      expect(this.$static.interpreterForWitnessLabel).toBeVisible(),

      expect(this.$static.orText).toBeVisible(),

      expect(this.$static.noInterpreterSupportRequiredLabel).toHaveText('I do not need to request any interpreter support at this time'),
      expect(this.$static.noInterpreterSupportRequiredLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { typeOfSupport: WhoNeedsInterpretorType; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    switch (options.typeOfSupport) {
      case 'Interpreter for applicant':
        await this.$interactive.interpreterForAppellantCheckbox.check();
        await expect(this.$interactive.interpreterForAppellantCheckbox).toBeChecked();
        break;
      case 'Interpreter for one or more witness':
        await this.$interactive.interpreterForWitnessCheckbox.check();
        await expect(this.$interactive.interpreterForWitnessCheckbox).toBeChecked();
        break;
      case 'Interpretor for applicant and witness':
        await this.$interactive.interpreterForAppellantCheckbox.check();
        await expect(this.$interactive.interpreterForAppellantCheckbox).toBeChecked();

        await this.$interactive.interpreterForWitnessCheckbox.check();
        await expect(this.$interactive.interpreterForWitnessCheckbox).toBeChecked();
        break;
      case 'No interpretor required':
        await this.$interactive.noInterpreterSupportRequiredCheckbox.check();
        await expect(this.$interactive.noInterpreterSupportRequiredCheckbox).toBeChecked();
        break;
      default:
        throw new Error(`Invalid type of support: ${options.typeOfSupport}`);
    }

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
