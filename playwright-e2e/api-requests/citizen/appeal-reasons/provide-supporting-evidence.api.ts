import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm, cui_uploadDocument } from '../../../utils/api-requests-utils';

export class ProvideSupportingEvidenceApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'case-building/provide-supporting-evidence',
    });

    const fileName = options.nameOfFileToUpload ?? 'Provide_Supporting_Evidence.txt';

    await cui_uploadDocument({
      apiContext: this.apiContext,
      path: `case-building/reason-for-appeal/supporting-evidence/upload/file?_csrf=${csrfToken}`,
      fileUploadFieldName: 'file-upload',
      addtionalFields: {
        _csrf: csrfToken,
        uploadFile: '',
      },
      nameOfFileToUpload: fileName,
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'case-building/reason-for-appeal/supporting-evidence/submit',
      form: {
        _csrf: csrfToken,
        saveAndContinue: '',
      },
    });
  }
}
