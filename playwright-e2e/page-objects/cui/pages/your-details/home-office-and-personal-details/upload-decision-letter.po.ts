import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import path from 'path';

export class UploadDecisionLetterPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

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
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'home-office-upload-decision-letter', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const filePath = path.join(process.cwd(), 'playwright-e2e', 'fixtures', 'documents');
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Upload_Document_Test_1.txt';

    await this.$interactive.chooseFileToUploadInput.setInputFiles(path.join(filePath, fileToUpload));
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
