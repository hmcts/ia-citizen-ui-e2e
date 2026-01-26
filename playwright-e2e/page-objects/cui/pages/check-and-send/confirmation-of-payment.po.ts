import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class ConfirmationOfPaymentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    appealProgressButton: this.page.locator('a[class="govuk-button"]', {
      hasText: 'See your appeal progress',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Your appeal details have been sent',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnConfirmationOfPaymentPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('confirmation-payment')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }
}
