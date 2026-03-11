import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class RequestMoreTimeSentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    seeYourAppealProgressButton: this.page.getByRole('button', { name: 'See your appeal progress', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly whatHappensNextLocator = this.page.getByRole('heading', { level: 2, name: 'What happens next', exact: true });
  private readonly thingsYouCanNowDoHeadingLocator = this.page.getByRole('heading', { level: 3, name: 'Things you can do now', exact: true });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Your request has been sent to the Tribunal', exact: true }),
    whatHappensNextHeading: this.whatHappensNextLocator,
    whatHappensNextBulletPoint1: this.whatHappensNextLocator.locator('+ div li').nth(0),
    whatHappensNextBulletPoint2: this.whatHappensNextLocator.locator('+ div li').nth(1),
    thingsYouCanNowDoHeading: this.thingsYouCanNowDoHeadingLocator,
    thingsYouCanNowDoBulletPoint1: this.thingsYouCanNowDoHeadingLocator.locator('+ ul li').nth(0),
    thingsYouCanNowDoBulletPoint2: this.thingsYouCanNowDoHeadingLocator.locator('+ ul li').nth(1),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'request-more-time-sent', pageHeading: this.$static.pageHeading });
  }
}
