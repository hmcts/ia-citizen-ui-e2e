import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class ApplicantDobPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/date-birth"])');

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
      hasText: 'What is your date of birth?',
    }),
    dateHintText: this.pageForm.locator('div[id="date-hint"]'),
    dayLabel: this.pageForm.locator('label[for="day"]'),
    monthLabel: this.pageForm.locator('label[for="month"]'),
    yearLabel: this.pageForm.locator('label[for="year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'date-birth', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.dateHintText).toHaveText('For example, 31 3 1980'),
      expect(this.$static.dateHintText).toBeVisible(),

      expect(this.$static.dayLabel).toHaveText('Day'),
      expect(this.$static.dayLabel).toBeVisible(),

      expect(this.$static.monthLabel).toHaveText('Month'),
      expect(this.$static.monthLabel).toBeVisible(),

      expect(this.$static.yearLabel).toHaveText('Year'),
      expect(this.$static.yearLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(dateOfBirth: { day: number; month: number; year: number; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (dateOfBirth.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const day = dateOfBirth.day.toString();
    const month = dateOfBirth.month.toString();
    const year = dateOfBirth.year.toString();

    await this.$inputs.day.fill(day);
    await expect(this.$inputs.day).toHaveValue(day);

    await this.$inputs.month.fill(month);
    await expect(this.$inputs.month).toHaveValue(month);

    await this.$inputs.year.fill(year);
    await expect(this.$inputs.year).toHaveValue(year);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
