import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { YesOrNoType } from '../../../../../types';

export class InTheUkPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly pageForm = this.page.locator('body:has(form[action="/in-the-uk"])');

  public readonly $interactive = {
    continueButton: this.pageForm.locator('button[name="continue"]', {
      hasText: 'Continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Are you currently living in the United Kingdom?',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnInTheUkPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('in-the-uk')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }

  public async completePageAndContinue(option: { isUserInTheUk: YesOrNoType }): Promise<void> {
    const element = this.pageForm.locator(`input[type="radio"][value="${option.isUserInTheUk}"]`);

    switch (option.isUserInTheUk) {
      case 'Yes':
        await expect(element).toBeChecked();
        break;
      case 'No':
        await element.check();
        await expect(element).toBeChecked();
        break;
      default:
        throw new Error(`Option value: ${option.isUserInTheUk} is not valid`);
    }

    await this.navigationClick(this.$interactive.continueButton);
  }
}
