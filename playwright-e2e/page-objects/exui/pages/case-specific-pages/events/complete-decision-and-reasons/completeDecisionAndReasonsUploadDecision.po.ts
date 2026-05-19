import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils/data.utils';

export class CompleteDecisionAndReasonsUploadDecisionPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly dataUtils = new DataUtils();

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    chooseFileButton: this.page.locator('input[id="finalDecisionAndReasonsDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
    confirmDocumentSignedTodayCheckbox: this.page.locator('input[name="isDocumentSignedToday_values"]'),
    feeAwardedIsConsistentWithDecisionCheckbox: this.page.locator('input[name="isFeeConsistentWithDecision_values"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Complete decision and reasons', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    uploadDecisionAndReasonsHeading: this.page.getByRole('heading', { level: 2, name: 'Upload your decision and reasons as a PDF', exact: true }),
    decisionAndReasonsLabel: this.page.locator('label[for="finalDecisionAndReasonsDocument"]'),
    importantText: this.page.getByText('IMPORTANT:', { exact: true }),
    importantBulletPoint: this.page.locator('markdown', { hasText: 'IMPORTANT:' }).locator('li'),
    documentSignedTodayLabel: this.page.locator('label[for*="isDocumentSignedToday"]'),
    feeAwardedIsConsistentLabel: this.page.locator('label[for*="isFeeConsistentWithDecision"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/sendDecisionAndReasons/sendDecisionAndReasonsuploadDecisionAndReasons',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.uploadDecisionAndReasonsHeading).toBeVisible(),
      expect(this.$static.decisionAndReasonsLabel).toBeVisible(),
      expect(this.$static.decisionAndReasonsLabel).toHaveText('Decision and reasons'),
      expect(this.$static.importantText).toBeVisible(),
      expect(this.$static.importantBulletPoint.nth(0)).toBeVisible(),
      expect(this.$static.importantBulletPoint.nth(0)).toHaveText("The date of signature must be today's date"),
      expect(this.$static.importantBulletPoint.nth(1)).toBeVisible(),
      expect(this.$static.importantBulletPoint.nth(1)).toHaveText('You can only apply a fee award when you have allowed the appeal'),
      expect(this.$static.documentSignedTodayLabel).toBeVisible(),
      expect(this.$static.documentSignedTodayLabel).toHaveText("I confirm this document is signed with today's date."),
      expect(this.$static.feeAwardedIsConsistentLabel).toBeVisible(),
      expect(this.$static.feeAwardedIsConsistentLabel).toHaveText('Ensure that the fee award is consistent with your decision.'),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    await this.verifyAllTextOnPage();

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'SendDecisionAndReasons.pdf';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    const uploadingText = this.page.locator('span[role="alert"]', { hasText: 'Uploading' });

    await expect(async () => {
      await Promise.all([
        this.interceptNetworkRequestToVerifyUploadDocumentSucceeded({ timeoutMs: 15_000 }),
        this.$interactive.chooseFileButton.setInputFiles(filePath),
        expect(uploadingText).toBeVisible({ timeout: 15_000 }),
      ]);
    }).toPass({ intervals: [100], timeout: 30_000 });

    await expect(uploadingText).not.toBeVisible({ timeout: 10_000 });
    await expect(this.$interactive.chooseFileButton).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await this.$interactive.confirmDocumentSignedTodayCheckbox.check();
    await expect(this.$interactive.confirmDocumentSignedTodayCheckbox).toBeChecked();

    await this.$interactive.feeAwardedIsConsistentWithDecisionCheckbox.check();
    await expect(this.$interactive.feeAwardedIsConsistentWithDecisionCheckbox).toBeChecked();

    await this.navigationClick(this.$interactive.continueButton);
  }

  private async interceptNetworkRequestToVerifyUploadDocumentSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse((res) => res.request().method() === 'POST' && res.url().includes('documentsv2'), {
      timeout: options.timeoutMs,
    });

    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
