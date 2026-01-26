import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HomeOfficeReferenceNumberPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/home-office-reference-number"])');

  public readonly $inputs = {
    referenceNumber: this.pageForm.locator('input[name="homeOfficeRefNumber"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What is your Home Office reference number?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnHomeOfficeReferenceNumberPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('home-office-reference-number')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { homeOfficeReference: number }): Promise<void> {
    const homeOfficeReference = option.homeOfficeReference.toString();

    await this.$inputs.referenceNumber.fill(homeOfficeReference);
    await expect(this.$inputs.referenceNumber).toHaveValue(homeOfficeReference);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
