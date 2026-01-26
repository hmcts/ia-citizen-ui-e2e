import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class DecisionLetterReceivedPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/date-letter-received"])');

  public readonly $inputs = {
    day: this.pageForm.locator('input[name="day"]'),
    month: this.pageForm.locator('input[name="month"]'),
    year: this.pageForm.locator('input[name="year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'What date did you receive your decision letter from the Home Office?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnDecisionLetterReceivedPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('date-letter-received')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(dateDecisionLetterReceived: { day: number; month: number; year: number }): Promise<void> {
    const day = dateDecisionLetterReceived.day.toString();
    const month = dateDecisionLetterReceived.month.toString();
    const year = dateDecisionLetterReceived.year.toString();

    await this.$inputs.day.fill(day);
    await expect(this.$inputs.day).toHaveValue(day);

    await this.$inputs.month.fill(month);
    await expect(this.$inputs.month).toHaveValue(month);

    await this.$inputs.year.fill(year);
    await expect(this.$inputs.year).toHaveValue(year);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
