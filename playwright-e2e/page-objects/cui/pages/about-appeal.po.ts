import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../cui-base';

export class AboutAppealPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    appealTypeLink: this.page.locator('a[class="govuk-link"]', {
      hasText: 'Appeal type',
    }),
    homeOfficeAndPersonalDetailsLink: this.page.locator('a[class="govuk-link"]', {
      hasText: 'Your Home Office and personal details',
    }),
    yourContactDetailsLink: this.page.locator('a[class="govuk-link"]', {
      hasText: 'Your contact details',
    }),
    decisionWithOrWithoutHearingLink: this.page.locator('a[class="govuk-link"]', {
      hasText: 'Decision with or without a hearing',
    }),
    supportToPayTheFeeLink: this.page.locator('a[class="govuk-link"]', {
      hasText: 'Support to pay the fee',
    }),
    checkAndSendYourAppealDetailsLink: this.page.locator('a[class="govuk-link"]', {
      hasText: 'Check and send your appeal details',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1[class*="govuk-heading"]', {
      hasText: 'Tell us about your appeal',
    }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnAboutAppealPage(): Promise<void> {
    await Promise.all([
      expect(async () => {
        expect(this.page.url().includes('about-appeal')).toBeTruthy();
      }).toPass({ intervals: [100], timeout: 15_000 }),

      expect(this.$static.pageHeading).toBeVisible({ timeout: 15_000 }),
    ]);
  }
}
