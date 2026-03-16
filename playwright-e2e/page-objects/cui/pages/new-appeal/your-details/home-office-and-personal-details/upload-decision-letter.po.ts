import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../../cui-base';
import { DataUtils } from '../../../../../../utils';

export class UploadDecisionLetterPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private dataUtils = new DataUtils();
  private readonly pageForm = this.page.locator('body:has(form[action="/home-office-upload-decision-letter"])');

  public readonly $interactive = {
    chooseFileToUploadInput: this.pageForm.locator('input[id="file-upload"]'),
    uploadFileButton: this.pageForm.locator('button[name="uploadFile"]'),
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Upload your Home Office decision letter',
    }),
    fileUploadedTableRow: this.pageForm.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
    decisionByEmailHeading: this.pageForm.getByRole('heading', { level: 2 }).filter({ hasText: 'email' }),
    decisionByEmailText: this.pageForm.locator('p', { hasText: 'attached to the email.' }),
    decisionByPostHeading: this.pageForm.getByRole('heading', { level: 2 }).filter({ hasText: 'post' }),
    decisionByPostText: this.pageForm.locator('p', { hasText: 'If you have a smartphone' }),
    uploadFileText: this.pageForm.getByText('Upload a file', { exact: true }),
    uploadedFileText: this.pageForm.locator('table[id="files-uploaded"] [class="govuk-table__header"]'),
    noFilesUploadedText: this.pageForm.locator('td[class="govuk-table__cell"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'home-office-upload-decision-letter', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.decisionByEmailHeading).toHaveText('If you got your decision by email'),
      expect(this.$static.decisionByEmailHeading).toBeVisible(),

      expect(this.$static.decisionByEmailText).toHaveText('Upload the decision letter attached to the email.'),
      expect(this.$static.decisionByEmailText).toBeVisible(),

      expect(this.$static.decisionByPostHeading).toHaveText('If you got your decision by post'),
      expect(this.$static.decisionByPostHeading).toBeVisible(),

      expect(this.$static.decisionByPostText).toHaveText(
        'If you have a smartphone, you can use a scanner app to create a single document to upload. Or you can scan or take a photo of each page and upload each file individually.',
      ),
      expect(this.$static.decisionByPostText).toBeVisible(),

      expect(this.$static.uploadFileText).toBeVisible(),

      expect(this.$static.uploadedFileText).toHaveText('Uploaded file'),
      expect(this.$static.uploadedFileText).toBeVisible(),

      expect(this.$static.noFilesUploadedText).toHaveText('No files uploaded'),
      expect(this.$static.noFilesUploadedText).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string; verifyAllTextOnPage?: boolean }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Decision_Letter.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await expect(async () => {
      await Promise.all([
        this.interceptNetworkRequestToVerifyUploadDecisionLetterSucceeded({ timeoutMs: 15_000 }),
        this.$interactive.uploadFileButton.click(),
      ]);
    }).toPass({ intervals: [100], timeout: 30_000 });

    await expect(this.$static.fileUploadedTableRow.filter({ hasText: fileToUpload })).toBeVisible();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }

  private async interceptNetworkRequestToVerifyUploadDecisionLetterSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('home-office-upload-decision-letter/upload'),
      { timeout: options.timeoutMs },
    );

    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
