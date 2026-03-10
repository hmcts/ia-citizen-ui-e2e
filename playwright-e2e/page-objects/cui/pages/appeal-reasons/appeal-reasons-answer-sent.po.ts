import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../cui-base';

export class AppealReasonsAnswerSentPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    seeYourAppealProgressButton: this.page.getByRole('button', { name: 'See your appeal progress', exact: true }),
  } as const satisfies Record<string, Locator>;

  private readonly whatHappensNextLocator = this.page.getByRole('heading', { level: 2, name: 'What happens next', exact: true });

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Your answer has been sent', exact: true }),
    whatHappensNextHeading: this.whatHappensNextLocator,
    whatHappensNextFirstBulletPoint: this.whatHappensNextLocator.locator('+ div li').nth(0),
    whatHappensNextSecondBulletPoint: this.whatHappensNextLocator.locator('+ div li').nth(1),
    ifYouHaveQuestionsParagraph: this.page.locator('p', { hasText: 'If you have any questions about the appeal process' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'answer-sent', pageHeading: this.$static.pageHeading });
  }
}
