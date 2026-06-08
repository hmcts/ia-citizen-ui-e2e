import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';

export class OutOfCountryProtectionDepartureDatePage extends CuiBase {
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
      hasText: 'What date did you leave the UK after your Protection claim was refused?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ooc-protection-departure-date', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(dateApplicantLeftUk: { day: number; month: number; year: number }): Promise<void> {
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
