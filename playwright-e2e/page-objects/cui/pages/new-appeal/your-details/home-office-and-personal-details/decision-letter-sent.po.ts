import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

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
    decisionByEmailHeading: this.pageForm.getByRole('heading', { level: 2 }).filter({ hasText: 'email' }),
    decisionByEmailText: this.pageForm.locator('p', { hasText: 'email was sent' }),
    decisionByPostHeading: this.pageForm.getByRole('heading', { level: 2 }).filter({ hasText: 'post' }),
    decisionByPostText: this.pageForm.locator('p', { hasText: 'Enter the date stamped on the front' }),
    enterDateText: this.pageForm.getByText('letter was sent'),
    dateHintText: this.pageForm.locator('div[id="date-hint"]'),
    dayLabel: this.pageForm.locator('label[for="day"]'),
    monthLabel: this.pageForm.locator('label[for="month"]'),
    yearLabel: this.pageForm.locator('label[for="year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'date-letter-sent', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.decisionByEmailHeading).toHaveText('If you got your decision by email'),
      expect(this.$static.decisionByEmailHeading).toBeVisible(),

      expect(this.$static.decisionByEmailText).toHaveText('Enter the date the email was sent by the Home Office.'),
      expect(this.$static.decisionByEmailText).toBeVisible(),

      expect(this.$static.decisionByPostHeading).toHaveText('If you got your decision by post'),
      expect(this.$static.decisionByPostHeading).toBeVisible(),

      expect(this.$static.decisionByPostText).toHaveText(
        "Enter the date stamped on the front of the envelope. If you don't have the envelope, enter the date on the first page of the decision letter.",
      ),
      expect(this.$static.decisionByPostText).toBeVisible(),

      expect(this.$static.enterDateText).toHaveText('Enter the date the letter was sent'),
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

  public async completePageAndContinue(dateDecisionLetterSent: {
    day: number;
    month: number;
    year: number;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (dateDecisionLetterSent.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

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
