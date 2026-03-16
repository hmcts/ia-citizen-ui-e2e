import { Page, Locator, expect } from '@playwright/test';
import { CuiBase } from '../../../cui-base';
import { DataUtils } from '../../../../../utils';
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
    appealsToBeMadeWithin28DaysText: this.pageForm.getByText('Appeals should be made within 28 days'),
    whyIsAppealLateLabel: this.pageForm.locator('label[for="appeal-late"]'),
    supportingEvidenceHeading: this.pageForm.getByRole('heading', { level: 2, name: 'Supporting evidence' }),
    uploadOnePieceOfEvidenceBulletPoint: this.pageForm.locator('li', { hasText: 'You can upload one piece of evidence' }),
    provideEvidenceNotInEnglishBulletPoint: this.pageForm.locator('li', {
      hasText: 'If you provide evidence that is not in English',
    }),
    uploadFileLabel: this.pageForm.locator('label[for="file-upload"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnPage(): Promise<void> {
    await this.verifyUserIsOnExpectedPage({ urlPath: 'late-appeal', pageHeading: this.$static.pageHeading });
  }

  private async verifyAllTextOnPage(): Promise<void> {
    await Promise.all([
      expect(this.$static.appealsToBeMadeWithin28DaysText).toHaveText(
        'Appeals should be made within 28 days of the date the decision letter was received. You may still be able to appeal. Please tell us why your appeal is late, and provide supporting evidence if you have it.',
      ),
      expect(this.$static.appealsToBeMadeWithin28DaysText).toBeVisible(),

      expect(this.$static.whyIsAppealLateLabel).toHaveText('Why is your appeal late?'),
      expect(this.$static.whyIsAppealLateLabel).toBeVisible(),

      expect(this.$static.supportingEvidenceHeading).toHaveText('Supporting evidence for why your appeal is late'),
      expect(this.$static.supportingEvidenceHeading).toBeVisible(),

      expect(this.$static.uploadOnePieceOfEvidenceBulletPoint).toHaveText(
        'You can upload one piece of evidence to support your answer such as a letter, photo or document. If you are taking a picture of a letter, place it on a flat surface and take the picture from above',
      ),
      expect(this.$static.uploadOnePieceOfEvidenceBulletPoint).toBeVisible(),

      expect(this.$static.provideEvidenceNotInEnglishBulletPoint).toHaveText(
        'If you provide evidence that is not in English, you must also provide an English translation of that evidence',
      ),
      expect(this.$static.provideEvidenceNotInEnglishBulletPoint).toBeVisible(),

      expect(this.$static.uploadFileLabel).toHaveText('Upload a file'),
      expect(this.$static.uploadFileLabel).toBeVisible(),
    ]);
  }

  public async completePageAndContinue(options: {
    reasonForLateAppeal: string;
    nameOfFileToUpload?: string;
    verifyAllTextOnPage?: boolean;
  }): Promise<void> {
    if (options.verifyAllTextOnPage) {
      await this.verifyAllTextOnPage();
    }

    await this.$inputs.appealLateTextArea.fill(options.reasonForLateAppeal);
    await expect(this.$inputs.appealLateTextArea).toHaveValue(options.reasonForLateAppeal);

    const fileToUpload = options.nameOfFileToUpload ? options.nameOfFileToUpload : 'Late_Appeal.txt';
    const filePath = await this.dataUtils.fetchDocumentUploadPath(fileToUpload);

    await this.$interactive.chooseFileToUploadInput.setInputFiles(filePath);
    await expect(this.$interactive.chooseFileToUploadInput).toHaveValue(new RegExp(`${fileToUpload.replace('.', '\\.')}$`));

    await this.navigationClick(this.$interactive.saveAndContinueButton);
  }
}
