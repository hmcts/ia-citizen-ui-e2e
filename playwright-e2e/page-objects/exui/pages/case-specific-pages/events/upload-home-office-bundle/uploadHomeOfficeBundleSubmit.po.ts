import { Page, Locator, expect } from '@playwright/test';
import { ExuiBase } from '../../../../exui-base';

export class UploadHomeOfficeBundleSubmitPage extends ExuiBase {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    uploadButton: this.page.getByRole('button', { name: 'Upload', exact: true }),
    previousButton: this.$commonElements.previousButton,
    cancelButton: this.$commonElements.cancelButton,
    changeUplaodHomeOfficeBundleButton: this.page.locator('span[aria-label="Change Upload Home Office bundle"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.page.getByRole('heading', { level: 1, name: 'Upload Home Office bundle', exact: true }),
    caseRecordHeading: this.page.getByRole('heading', { level: 1, name: 'Case record for' }),
    checkYourAnswersHeading: this.page.getByRole('heading', { level: 2, name: 'Check your answers', exact: true }),
    checkInformationText: this.page.locator('span', { hasText: 'Check the information' }),
    uploadHomeOfficeBundleText: this.page.locator('tr th span', { hasText: 'Upload Home Office bundle' }),
    tableTitle: this.page.locator('dl[class="complex-panel-title"]'),
    uploadAFileLabel: this.page.locator('th[id="complex-panel-simple-field-label"] span', { hasText: 'Upload a file' }),
    describeTheDocumentLabel: this.page.locator('[id="complex-panel-simple-field-label"] span', { hasText: 'Describe the document' }),
    describeTheDocumentValue: this.page.locator('ccd-read-text-area-field span'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({
      urlPath: 'trigger/uploadHomeOfficeBundle/submit',
      pageHeading: this.$static.pageHeading,
    });
  }

  public async verifyCorrectInformationIsDisplayed(options: { fileDescription: string; nameOfFileUploaded?: string }): Promise<void> {
    const uploadedFile = options.nameOfFileUploaded ? options.nameOfFileUploaded : 'Home_Office_Bundle.txt';

    await Promise.all([
      expect(this.$static.caseRecordHeading).toBeVisible(),
      expect(this.$static.checkYourAnswersHeading).toBeVisible(),

      expect(this.$static.checkInformationText).toHaveText('Check the information below carefully.'),
      expect(this.$static.checkInformationText).toBeVisible(),

      expect(this.$static.uploadHomeOfficeBundleText).toBeVisible(),

      expect(this.$static.tableTitle).toHaveText('Upload Home Office bundle 1'),
      expect(this.$static.tableTitle).toBeVisible(),

      expect(this.$static.uploadAFileLabel).toBeVisible(),
      expect(this.page.getByRole('button', { name: uploadedFile, exact: true })).toBeVisible(),

      expect(this.$static.describeTheDocumentLabel).toBeVisible(),
      expect(this.$static.describeTheDocumentValue).toHaveText(options.fileDescription),
      expect(this.$static.describeTheDocumentValue).toBeVisible(),

      expect(this.$interactive.changeUplaodHomeOfficeBundleButton).toHaveText('Change'),
      expect(this.$interactive.changeUplaodHomeOfficeBundleButton).toBeVisible(),
    ]);
  }

  public async submitEvent(): Promise<void> {
    await this.navigationClick(this.$interactive.uploadButton);
  }
}
