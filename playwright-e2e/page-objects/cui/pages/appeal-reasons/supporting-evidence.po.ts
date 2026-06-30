import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { YesOrNoType } from '../../../../citizen-types';

export class SupportingEvidencePage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly needMoreTimeHeading = this.page.getByRole('heading', { name: 'Need more time?', exact: true });
  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Do you want to provide supporting evidence?',
    }),
    needMoreTimeHeading: this.needMoreTimeHeading,
    needMoreTimeHeadingFirstBulletPoint: this.needMoreTimeHeading.locator('+ ul li').nth(0),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'supporting-evidence', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.needMoreTimeHeading).toBeVisible(),

      expect(this.$static.needMoreTimeHeadingFirstBulletPoint).toHaveText(
        "If you want to provide evidence but don't have it right now, you can save your answer and ask for more time",
      ),
      expect(this.$static.needMoreTimeHeadingFirstBulletPoint).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { doYouWishToProvideSupportingEvidence: YesOrNoType }): Promise<void> {
    const element = this.page.locator(`input[type="radio"][value="${options.doYouWishToProvideSupportingEvidence.toLowerCase()}"]`);
    await element.check();
    await expect(element).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }
}
