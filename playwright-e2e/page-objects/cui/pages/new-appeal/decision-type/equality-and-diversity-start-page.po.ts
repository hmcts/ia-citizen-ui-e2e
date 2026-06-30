import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';

export class EqualityAndDiversityStartPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Equality and diversity questions',
    }),
    optionalQuestionsText: this.page.locator('div[class="govuk-panel__body"] p').nth(0),
    answersWillNotAffectAppealText: this.page.locator('div[class="govuk-panel__body"] p').nth(1),
    yourAnswersWillHelpUsText: this.page.locator('p', { hasText: 'Your answers will help us' }),
    privacyPolicyText: this.page.locator('p', { hasText: 'in our privacy policy' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'start-page', pageHeading: this.$static.pageHeading });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.optionalQuestionsText).toHaveText('These are optional questions about you.'),
      expect(this.$static.optionalQuestionsText).toBeVisible(),

      expect(this.$static.answersWillNotAffectAppealText).toHaveText('Your answers will not affect your appeal.'),
      expect(this.$static.answersWillNotAffectAppealText).toBeVisible(),

      expect(this.$static.yourAnswersWillHelpUsText).toHaveText('Your answers will help us check we are treating people fairly and equally.'),
      expect(this.$static.yourAnswersWillHelpUsText).toBeVisible(),

      expect(this.$static.privacyPolicyText).toHaveText('Find out how we use this information in our privacy policy.'),
      expect(this.$static.privacyPolicyText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(): Promise<void> {
    const element = this.page.locator('button[type="submit"]', { hasText: "I don't want to answer these questions" });
    await this.navigationClick(element);
  }
}
