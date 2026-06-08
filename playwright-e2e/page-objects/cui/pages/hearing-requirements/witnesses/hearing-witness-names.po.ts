import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingWitnessNamesPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    givenName: this.page.locator('input[name="witnessName"]'),
    familyName: this.page.locator('input[name="witnessFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.getByRole('button', { name: 'Save and continue', exact: true }),
    addAnotherWitnessButton: this.page.getByRole('button', { name: 'Add another witness', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Add witnesses names', level: 1, exact: true }),
    witnessHintText: this.page.locator('p', { hasText: 'You can add' }),
    givenNameLabel: this.page.locator('label[for="witnessName"]'),
    familyNameLabel: this.page.locator('label[for="witnessFamilyName"]'),
    addedWitnessesHeading: this.page.getByRole('heading', { name: 'Added witnesses', level: 2, exact: true }),
    witnessNameAddedRow: this.page.locator('dt[class="govuk-summary-list__key"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-witness-names', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.witnessHintText).toHaveText('You can add up to 10 witnesses.'),
      expect(this.$static.witnessHintText).toBeVisible(),

      expect(this.$static.givenNameLabel).toHaveText('Witness given names'),
      expect(this.$static.givenNameLabel).toBeVisible(),

      expect(this.$static.familyNameLabel).toHaveText('Witness family name'),
      expect(this.$static.familyNameLabel).toBeVisible(),

      expect(this.$static.addedWitnessesHeading).toBeHidden(),
    ]);
  }

  public async completePageAndContinue(option: { givenNames: string | string[]; familyName: string; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (option.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const givenNames = Array.isArray(option.givenNames) ? option.givenNames.join(' ') : option.givenNames;
    const familyName = option.familyName;

    await this.$inputs.givenName.fill(givenNames);
    await expect(this.$inputs.givenName).toHaveValue(givenNames);

    await this.$inputs.familyName.fill(familyName);
    await expect(this.$inputs.familyName).toHaveValue(familyName);

    await this.$interactive.addAnotherWitnessButton.click();

    await expect(this.$static.addedWitnessesHeading).toBeVisible();
    await expect(this.$static.witnessNameAddedRow).toHaveText(`${givenNames} ${familyName}`);
    await expect(this.$static.witnessNameAddedRow).toBeVisible();

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
