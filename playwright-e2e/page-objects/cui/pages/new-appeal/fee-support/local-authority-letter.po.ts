import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { DataUtils } from '../../../../../utils';

export class LocalAuthorityLetterPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly dataUtils = new DataUtils();

  public readonly $interactive = {
    chooseFileToUploadInput: this.page.locator('input[id="file-upload"]'),
    uploadFileButton: this.page.locator('button[name="uploadFile"]'),
    saveAndContinueButton: this.page.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.locator('h1', {
      hasText: 'Upload local authority letter',
    }),
    fileUploadedTableRow: this.page.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'local-authority-letter', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(options: { nameOfFileToUpload?: string }): Promise<void> {
    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Local_Authority_Letter.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await expect(async () => {
      await Promise.all([
        this.interceptNetworkRequestToVerifyUploadDecisionLetterSucceeded({ timeoutMs: 15_000 }),
        this.$interactive.uploadFileButton.click(),
      ]);
    }).toPass({ intervals: [1_000], timeout: 30_000 });

    await expect(this.$static.fileUploadedTableRow.filter({ hasText: fileToUpload })).toBeVisible();
    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }

  private async interceptNetworkRequestToVerifyUploadDecisionLetterSucceeded(options: { timeoutMs: number }): Promise<void> {
    const response = await this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('local-authority-letter/upload'),
      { timeout: options.timeoutMs },
    );

    const status = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  }
}
