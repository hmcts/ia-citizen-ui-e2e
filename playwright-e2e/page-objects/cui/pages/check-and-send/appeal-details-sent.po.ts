import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class AppealDetailsSentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    payForAppealButton: this.page.locator('a[class="govuk-button"]', { hasText: 'Pay for this appeal' }),
    seeYourAppealProgressButton: this.page.locator('a[class="govuk-button"]', { hasText: 'See your appeal progress' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page
      .locator('h1', { hasText: 'Your appeal has been submitted' })
      .or(this.page.locator('h1', { hasText: 'Your appeal details have been sent' }))
      .or(this.page.locator('h1', { hasText: 'You have sent your appeal details' })),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnAppealDetailsSentPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('appeals-details-sent')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }
}
