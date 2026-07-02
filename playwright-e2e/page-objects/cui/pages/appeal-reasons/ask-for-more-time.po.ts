import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class AskForMoreTimePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    askForMoreTime: this.page.locator('textarea[name="askForMoreTime"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly supportingEvidenceHeadingLocator = this.page.getByRole('heading', { level: 2, name: 'Supporting evidence' });
  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Ask for more time', exact: true }),
    howMuchTimeAndWhyYouNeedItText: this.page.locator('p', { hasText: 'You must tell us how much time' }),
    youMightNotGetMoreTimeText: this.page.locator('div', { hasText: 'You might not get more time' }).last(),
    askForMoreTimeLabel: this.page.locator('label[for="askForMoreTime"]'),
    supportingEvidenceHeading: this.supportingEvidenceHeadingLocator,
    supportingEvidenceBulletPoint1: this.supportingEvidenceHeadingLocator.locator('+ ul li').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'ask-for-more-time', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.howMuchTimeAndWhyYouNeedItText).toHaveText(
        'You must tell us how much time you need and why you need it. You should provide supporting evidence for your answer if you have any.',
      ),
      expect(this.$static.howMuchTimeAndWhyYouNeedItText).toBeVisible(),

      expect(this.$static.youMightNotGetMoreTimeText).toHaveText(
        'You might not get more time. You should still respond to the Tribunal by the date you were given if you can.',
      ),
      expect(this.$static.youMightNotGetMoreTimeText).toBeVisible(),

      expect(this.$static.askForMoreTimeLabel).toHaveText('How much time do you need and why do you need it?'),
      expect(this.$static.askForMoreTimeLabel).toBeVisible(),

      expect(this.$static.supportingEvidenceHeading).toHaveText('Supporting evidence for why you need more time'),
      expect(this.$static.supportingEvidenceHeading).toBeVisible(),

      expect(this.$static.supportingEvidenceBulletPoint1).toHaveText(
        'You will be able to add supporting evidence for your answer on the next page if you want to.',
      ),
      expect(this.$static.supportingEvidenceBulletPoint1).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { howMuchAndWhyMoreTimeNeeded: string }): Promise<void> {
    await this.$inputs.askForMoreTime.fill(options.howMuchAndWhyMoreTimeNeeded);
    await expect(this.$inputs.askForMoreTime).toHaveValue(options.howMuchAndWhyMoreTimeNeeded);
    await this.navigationClick(this.$interactive.continueButton);
  }
}
