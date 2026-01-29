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

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'confirm', pageHeading: this.$static.pageHeading });
  }
}
