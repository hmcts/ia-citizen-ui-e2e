import { Page, Locator } from '@playwright/test';
import { CuiBase } from '../../cui-base';

type listOfQuestions = "Why do you think the Tribunal's decision is wrong?" | 'Supporting evidence';

export class FtpaCheckAnswersPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  public $questionLocator = (question: listOfQuestions): Locator => {
    return this.page.locator('dt[class="govuk-summary-list__key"]').getByText(question, { exact: true });
  };

  public $questionValueLocator(question: listOfQuestions): Locator {
    return this.page
      .locator('div[class="govuk-summary-list__row"]')
      .filter({
        has: this.page.locator('dt[class="govuk-summary-list__key"]', { hasText: question }),
      })
      .locator('dd[class="govuk-summary-list__value"]');
  }

  public $changeAnswerToQuestionLocator(question: listOfQuestions): Locator {
    return this.page
      .locator('div[class="govuk-summary-list__row"]')
      .filter({
        has: this.page.locator('dt[class="govuk-summary-list__key"]', { hasText: question }),
      })
      .locator('dd[class="govuk-summary-list__actions"] a');
  }

  public readonly $interactive = {
    confirmAndSendButton: this.page.getByRole('button', { name: 'Confirm and send', exact: true }),
    cancelButton: this.page.getByRole('link', { name: 'Cancel', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Check your answer', exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'ftpa-check-answers',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async confirmAndSend(): Promise<void> {
    await this.navigationClick(this.$interactive.confirmAndSendButton);
  }
}
