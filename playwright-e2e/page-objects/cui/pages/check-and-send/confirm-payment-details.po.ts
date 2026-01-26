import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class ConfirmPaymentDetailsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    confirmPaymentButton: this.page.locator('button[type="submit"]', { hasText: 'Confirm payment' }),
    cancelPaymentButton: this.page.locator('button[type="submit"]', { hasText: 'Cancel payment' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', { hasText: 'Confirm your payment' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnConfirmPaymentDetailsPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('confirm')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }
}
