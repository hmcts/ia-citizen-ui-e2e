import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class SponsorNamePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/sponsor-name"])');

  public readonly $inputs = {
    givenName: this.pageForm.locator('input[name="sponsorGivenNames"]'),
    familyName: this.pageForm.locator('input[name="sponsorFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: `What is your sponsor's name?`,
    }),
    givenNameLabel: this.pageForm.locator('label[for="sponsorGivenNames"]'),
    familyNameLabel: this.pageForm.locator('label[for="sponsorFamilyName"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'sponsor-name', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.givenNameLabel).toHaveText('Given names'),
      expect(this.$static.givenNameLabel).toBeVisible(),

      expect(this.$static.familyNameLabel).toHaveText('Family name'),
      expect(this.$static.familyNameLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { givenNames: string | string[]; familyName: string; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const givenNames = Array.isArray(options.givenNames) ? options.givenNames.join(' ') : options.givenNames;
    const familyName = options.familyName;

    await this.$inputs.givenName.fill(givenNames);
    await expect(this.$inputs.givenName).toHaveValue(givenNames);

    await this.$inputs.familyName.fill(familyName);
    await expect(this.$inputs.familyName).toHaveValue(familyName);

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
