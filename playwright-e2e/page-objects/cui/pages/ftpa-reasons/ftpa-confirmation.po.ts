import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class FtpaConfirmationPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    seeYourAppealProgressButton: this.page.getByRole('button', { name: 'See your appeal progress', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly whatHappensNextLocator = this.page.getByRole('heading', { level: 2, name: 'What happens next', exact: true });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', {
      level: 1,
      name: 'Your application for permission to appeal to the Upper Tribunal has been sent',
      exact: true,
    }),
    whatHappensNextHeading: this.whatHappensNextLocator,
    whatHappensNextBulletPoint: this.whatHappensNextLocator.locator('+ div li'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ftpa-confirmation', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.whatHappensNextHeading).toBeVisible(),
      expect(this.$static.whatHappensNextBulletPoint.nth(0)).toBeVisible(),
      expect(this.$static.whatHappensNextBulletPoint.nth(0)).toHaveText('A judge will look at your application and decide what will happen next'),
      expect(this.$static.whatHappensNextBulletPoint.nth(1)).toBeVisible(),
      expect(this.$static.whatHappensNextBulletPoint.nth(1)).toHaveText('The Tribunal will contact you when the judge has made a decision'),
    ]);
  }

  public async clickSeeYourAppealProgressButton(): Promise<void> {
    await this.navigationClick(this.$interactive.seeYourAppealProgressButton);
  }
}
