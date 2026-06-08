import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class OutOfCountryHrInsidePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    day: this.page.locator('input[name="day"]'),
    month: this.page.locator('input[name="month"]'),
    year: this.page.locator('input[name="year"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'What date did you leave the UK after your application to stay in the country was refused?',
    }),
    enterDateText: this.page.getByText('Enter the date', { exact: true }),
    dateHintText: this.page.locator('div[id="date-hint"]'),
    dayLabel: this.page.locator('label[for="day"]'),
    monthLabel: this.page.locator('label[for="month"]'),
    yearLabel: this.page.locator('label[for="year"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ooc-hr-inside', pageHeading: this.$static.pageHeading });
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

  public async completePageAndContinue(dateApplicantLeftUk: {
    day: number;
    month: number;
    year: number;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (dateApplicantLeftUk.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const day = dateApplicantLeftUk.day.toString();
    const month = dateApplicantLeftUk.month.toString();
    const year = dateApplicantLeftUk.year.toString();

    await this.$inputs.day.fill(day);
    await expect(this.$inputs.day).toHaveValue(day);

    await this.$inputs.month.fill(month);
    await expect(this.$inputs.month).toHaveValue(month);

    await this.$inputs.year.fill(year);
    await expect(this.$inputs.year).toHaveValue(year);
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
