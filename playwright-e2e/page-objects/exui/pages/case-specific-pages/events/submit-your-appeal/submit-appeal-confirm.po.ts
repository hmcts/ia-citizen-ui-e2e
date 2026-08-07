import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class SubmitAppealConfirmPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    closeAndReturnToCaseDetailsButton: this.$commonElements.closeAndReturnToCaseDetailsButton,
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Submit your appeal', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    appealSubmittedHeading: this.page.getByRole('heading', { level: 1, name: 'Your appeal has been submitted', exact: true }),
    doThisNextHeading: this.page.getByRole('heading', { level: 4, name: 'Do this next', exact: true }),
    doThisNextParagraph: this.page.getByRole('heading', { level: 4, name: 'Do this next', exact: true }).locator('+ p'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/submitAppeal/confirm',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.appealSubmittedHeading).toBeVisible(),
      expect(this.$static.doThisNextHeading).toBeVisible(),
      expect(this.$static.doThisNextParagraph).toBeVisible(),
      expect(this.$static.doThisNextParagraph).toHaveText(
        "You must now pay for this appeal. First create a service request, you can do this by selecting 'Create a service request' from the 'Next step' dropdown list. Then select 'Go'.",
      ),
    ]);
  }

  public async returnToCaseDetails(): Promise<void> {
    await this.navigationClick(this.$interactive.closeAndReturnToCaseDetailsButton);
  }
}
