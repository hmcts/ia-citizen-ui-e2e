import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, uploadDocument } from '../../../../utils/citizen-user.utils';

export class LateAppealApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { reasonForLateAppeal: string; nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'late-appeal',
    });

    const fileName = options.nameOfFileToUpload ?? 'Upload_Document_Test_1.txt';

    await uploadDocument({
      apiContext: this.apiContext,
      path: `late-appeal?_csrf=${csrfToken}`,
      addtionalFields: {
        _csrf: csrfToken,
        'appeal-late': options.reasonForLateAppeal,
        saveAndContinue: '',
      },
      fileUploadFieldName: 'file-upload',
      nameOfFileToUpload: fileName,
    });
  }
}
