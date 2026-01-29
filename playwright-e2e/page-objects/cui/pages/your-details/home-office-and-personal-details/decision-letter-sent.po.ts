import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class DecisionLetterSentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/date-letter-sent"])');

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
      hasText: 'What date was your decision letter sent?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'date-letter-sent', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(dateDecisionLetterSent: { day: number; month: number; year: number }): Promise<void> {
    const day = dateDecisionLetterSent.day.toString();
    const month = dateDecisionLetterSent.month.toString();
    const year = dateDecisionLetterSent.year.toString();

    await this.$inputs.day.fill(day);
    await expect(this.$inputs.day).toHaveValue(day);

    await this.$inputs.month.fill(month);
    await expect(this.$inputs.month).toHaveValue(month);

    await this.$inputs.year.fill(year);
    await expect(this.$inputs.year).toHaveValue(year);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
