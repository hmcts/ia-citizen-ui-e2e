import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class FeeWaiverPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Home Office fee waiver',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnFeeWaiverPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('fee-waiver')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }
}
