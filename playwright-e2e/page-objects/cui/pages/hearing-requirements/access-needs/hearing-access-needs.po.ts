import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class HearingAccessNeedsPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.page.getByRole('button', { name: 'Continue', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { name: 'Communication and access support', level: 1, exact: true }),
    hearingAccessNeedsHintText1: this.page.getByText('Use this form if you'),
    bulletPoint1: this.page.locator('p + ul li').nth(0),
    bulletPoint2: this.page.locator('p + ul li').nth(1),
    bulletPoint3: this.page.locator('p + ul li').nth(2),
    bulletPoint4: this.page.locator('p + ul li').nth(3),
    hearingAccessNeedsHintText2: this.page.getByText('You can request more'),
    hearingAccessNeedsHintText3: this.page.getByText('They will be provided'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'hearing-access-needs', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.hearingAccessNeedsHintText1).toHaveText('Use this form if you or anyone with you needs to request:'),
      expect(this.$static.hearingAccessNeedsHintText1).toBeVisible(),

      expect(this.$static.bulletPoint1).toHaveText('an interpreter for translating spoken language'),
      expect(this.$static.bulletPoint1).toBeVisible(),

      expect(this.$static.bulletPoint2).toHaveText('an interpreter for sign language'),
      expect(this.$static.bulletPoint2).toBeVisible(),

      expect(this.$static.bulletPoint3).toHaveText('step-free access'),
      expect(this.$static.bulletPoint3).toBeVisible(),

      expect(this.$static.bulletPoint4).toHaveText('a hearing loop'),
      expect(this.$static.bulletPoint4).toBeVisible(),

      expect(this.$static.hearingAccessNeedsHintText2).toHaveText('You can request more than one for you or any witnesses.'),
      expect(this.$static.hearingAccessNeedsHintText2).toBeVisible(),

      expect(this.$static.hearingAccessNeedsHintText3).toHaveText('They will be provided at the hearing.'),
      expect(this.$static.hearingAccessNeedsHintText3).toBeVisible(),
    ]);
  }

  public async continueOnToNextPage(): Promise<void> {
    await this.navigationClick(this.$interactive.continueButton);
  }
}
