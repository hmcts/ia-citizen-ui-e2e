import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class ApplicantNamePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/name"])');

  public readonly $inputs = {
    givenName: this.pageForm.locator('input[name="givenNames"]'),
    familyName: this.pageForm.locator('input[name="familyName"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your name?',
    }),
    givenNameLabel: this.pageForm.locator('label[for="givenNames"]'),
    familyNameLabel: this.pageForm.locator('label[for="familyName"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'name', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.givenNameLabel).toHaveText('Given names'),
      expect(this.$static.givenNameLabel).toBeVisible(),

      expect(this.$static.familyNameLabel).toHaveText('Family name'),
      expect(this.$static.familyNameLabel).toBeVisible(),
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

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
