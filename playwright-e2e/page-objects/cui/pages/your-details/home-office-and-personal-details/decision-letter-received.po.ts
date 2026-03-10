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
    enterDateText: this.pageForm.getByText('Enter the date', { exact: true }),
    dateHintText: this.pageForm.locator('div[id="date-hint"]'),
    dayLabel: this.pageForm.locator('label[for="day"]'),
    monthLabel: this.pageForm.locator('label[for="month"]'),
    yearLabel: this.pageForm.locator('label[for="year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'date-letter-received', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.enterDateText).toBeVisible(),

      expect(this.$static.dateHintText).toHaveText('For example, 31 3 2019'),
      expect(this.$static.dateHintText).toBeVisible(),

      expect(this.$static.dayLabel).toHaveText('Day'),
      expect(this.$static.dayLabel).toBeVisible(),

      expect(this.$static.monthLabel).toHaveText('Month'),
      expect(this.$static.monthLabel).toBeVisible(),

      expect(this.$static.yearLabel).toHaveText('Year'),
      expect(this.$static.yearLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(dateDecisionLetterReceived: {
    day: number;
    month: number;
    year: number;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (dateDecisionLetterReceived.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

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
