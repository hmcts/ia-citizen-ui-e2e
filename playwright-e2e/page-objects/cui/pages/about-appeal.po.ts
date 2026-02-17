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
    appealTypeStatus: this.page.locator('li.task-list__item', { has: this.page.locator('a[title="Appeal type"]') }).locator('strong'),
    homeOfficeAndPersonalDetailsStatus: this.page
      .locator('li.task-list__item', { has: this.page.locator('a[title="Your Home Office and personal details"]') })
      .locator('strong'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'about-appeal', pageHeading: this.$static.pageHeading });
  }
}
