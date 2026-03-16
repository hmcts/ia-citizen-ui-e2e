import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class HearingNeedsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    witnessLink: this.page.locator('a[id="witnessesLink"]'),
    accessNeedsLink: this.page.locator('a[id="accessNeedsLink"]'),
    otherNeedsLink: this.page.locator('a[id="otherNeedsLink"]'),
    datesToAvoidLink: this.page.locator('a[id="datesToAvoidLink"]'),
    checkAndSendLink: this.page.locator('a[id="checkAndSendLink"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Tell us what you will need at the hearing', level: 1, exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-needs', pageHeading: this.$static.pageHeading });
  }
}
