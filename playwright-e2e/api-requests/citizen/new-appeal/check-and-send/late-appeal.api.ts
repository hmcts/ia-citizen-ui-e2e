import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_uploadDocument } from '../../../../utils/api-requests-utils';

export class LateAppealApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { reasonForLateAppeal: string; nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'late-appeal',
    });

    const fileName = options.nameOfFileToUpload ?? 'Late_Appeal.txt';

    await cui_uploadDocument({
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
