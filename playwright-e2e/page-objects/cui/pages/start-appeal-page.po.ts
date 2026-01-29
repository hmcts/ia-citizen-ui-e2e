import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../cui-base';
import { config } from '../../../utils';

export class StartAppealPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    signInLink: this.page.locator('[class="govuk-link"]', {
      hasText: 'Sign in to continue with your appeal',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1[class*="govuk-heading"]', {
      hasText: 'Appeal an immigration or asylum decision',
    }),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.citizenUrl);
  }

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'start-appeal', pageHeading: this.$static.pageHeading, timeout: 60_000 });
  }
}
