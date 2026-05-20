import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { HomeOfficeAppealReviewOutcomeType } from '../../../../../../exui-event-types';

export class UploadHomeOfficeAppealResponseSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly outcomeTableRowLocator = this.page.locator('tr', { hasText: 'Outcome' });
  private readonly appealResponseTableRowLocator = this.page.locator('tr', { hasText: 'Upload the appeal response' });

  public readonly $interactive = {
    uploadButton: this.page.getByRole('button', { name: 'Upload', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeOutcomeButton: this.page.locator('span[aria-label="Change Outcome"]'),
    changeAppealResponseButton: this.page.locator('span[aria-label="Change Upload the appeal response"]'),
    uploadedFileNameButton: this.appealResponseTableRowLocator.getByRole('button'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload the appeal response', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    checkYouAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationCarefullyText: this.page.getByText('Check the information below carefully.', { exact: true }),
    outcomeQuestion: this.outcomeTableRowLocator.locator('th span'),
    outcomeValue: this.outcomeTableRowLocator.locator('td span').nth(0),
    appealResponseQuestion: this.appealResponseTableRowLocator.locator('th span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeAppealResponse/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyCorrectInformationIsDisplayed(options: {
    appealReviewOutcome: HomeOfficeAppealReviewOutcomeType;
    nameOfFileUploaded?: string;
  }): Promise<void> {
    const fileUploaded = options.nameOfFileUploaded ? options.nameOfFileUploaded : 'Home_Office_Appeal_Reason.txt';

    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.checkYouAnswersHeading).toBeVisible(),
      expect(this.$static.checkInformationCarefullyText).toBeVisible(),

      expect(this.$static.outcomeQuestion).toHaveText('Outcome'),
      expect(this.$static.outcomeQuestion).toBeVisible(),
      expect(this.$static.outcomeValue).toHaveText(options.appealReviewOutcome),
      expect(this.$static.outcomeValue).toBeVisible(),

      expect(this.$static.appealResponseQuestion).toHaveText('Upload the appeal response'),
      expect(this.$static.appealResponseQuestion).toBeVisible(),
      expect(this.$interactive.uploadedFileNameButton).toHaveText(fileUploaded),
      expect(this.$interactive.uploadedFileNameButton).toBeVisible(),

      expect(this.$interactive.changeOutcomeButton).toHaveText('Change'),
      expect(this.$interactive.changeOutcomeButton).toBeVisible(),

      expect(this.$interactive.changeAppealResponseButton).toHaveText('Change'),
      expect(this.$interactive.changeAppealResponseButton).toBeVisible(),
    ]);
  }

  public async submitEvent(): Promise<void> {
    await this.navigationClick(this.$interactive.uploadButton);
  }
}
