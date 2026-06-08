import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';
import { DataUtils } from '../../../../../../utils';

export class DecideFtpaApplicationDecisionAndReasonsDocumentPage extends ExuiBase {
  private readonly dataUtils: DataUtils = new DataUtils();
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    continueButton: this.$commonElements.continueButton,
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    chooseFileButton: this.page.locator('input[id="ftpaApplicationAppellantDocument"]'),
    cancelUploadButton: this.page.getByRole('button', { name: 'Cancel upload', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('span', { hasText: 'Decide FTPA application' }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    ftpaDecisionAndReasonsHeading: this.page.getByRole('heading', { level: 1, name: 'FTPA Decision and Reasons', exact: true }),
    adviceOnUploadsHeading: this.page.getByRole('heading', { level: 4, name: 'Advice on uploads', exact: true }),
    adviceOnUploadsBulletPoints: this.page.locator('markdown', { hasText: 'Advice on uploads' }).locator('li'),
    uploadFtpaDecisionAndReasonsHeading: this.page.getByRole('heading', { level: 4, name: 'Upload FTPA Decision and Reasons document', exact: true }),
    documentLabel: this.page.locator('label[for="ftpaApplicationAppellantDocument"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/decideFtpaApplication/decideFtpaApplicationftpaAppellantDecisionAndReasonsDocument',
      pageHeading: this.$static.pageHeading,
    });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.ftpaDecisionAndReasonsHeading).toBeVisible(),
      expect(this.$static.adviceOnUploadsHeading).toBeVisible(),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(0)).toHaveText('files must be no more than 100MB in size'),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(0)).toBeVisible(),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(1)).toHaveText('You can upload jpg, png, svg, gif, doc and PDF files'),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(1)).toBeVisible(),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(2)).toHaveText(
        'before uploading a file, give it a meaningful file name. For example, FTPA-Decision-and-reasons-JSmith.pdf',
      ),
      expect(this.$static.adviceOnUploadsBulletPoints.nth(2)).toBeVisible(),
      expect(this.$static.uploadFtpaDecisionAndReasonsHeading).toBeVisible(),
      expect(this.$static.documentLabel).toHaveText('Document'),
      expect(this.$static.documentLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    await this.verifyAllTextOnPage();

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Ftpa_Decision_And_Reasons.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    const uploadingText = this.page.locator('span[role="alert"]', { hasText: 'Uploading' });

    await expect(async () => {
      await Promise.all([
        this.interceptNetworkRequestToVerifyUploadDocumentSucceeded({ timeoutMs: 15_000 }),
        this.$interactive.chooseFileButton.setInputFiles(filePath),
        expect(uploadingText).toBeVisible({ timeout: 15_000 }),
      ]);
    }).toPass({ intervals: [1_000], timeout: 30_000 });

    await expect(uploadingText).not.toBeVisible({ timeout: 10_000 });
    await expect(this.$interactive.chooseFileButton).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

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
