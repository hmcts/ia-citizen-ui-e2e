import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../cui-base';
import { DataUtils } from '../../../../utils';
import path from 'path';

export class LateAppealPage extends CuiBase {
  constructor(page: Page) {
    super(page);
  }

  private readonly dataUtils = new DataUtils();
  private readonly pageForm = this.page.locator('body:has(form[action*="/late-appeal"])');

  public readonly $inputs = {
    appealLateTextArea: this.pageForm.locator('textarea[id="appeal-late"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    chooseFileToUploadInput: this.pageForm.locator('input[id="file-upload"]'),
    uploadFileButton: this.pageForm.locator('button[name="uploadFile"]'),
    saveAndContinueButton: this.pageForm.locator('button', {
      hasText: 'Save and continue',
    }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.pageForm.locator('h1', {
      hasText: 'Your appeal is late',
    }),
    fileUploadedTableRow: this.pageForm.locator('table[id="files-uploaded"] a[class="govuk-link"]').filter({ hasNotText: 'Delete' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'late-appeal', pageHeading: this.$static.pageHeading });
  }

  public async completePageAndContinue(options: { reasonForLateAppeal: string; nameOfFileToUpload?: string }): Promise<void> {
    await this.$inputs.appealLateTextArea.fill(options.reasonForLateAppeal);
    await expect(this.$inputs.appealLateTextArea).toHaveValue(options.reasonForLateAppeal);

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Upload_Document_Test_1.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
