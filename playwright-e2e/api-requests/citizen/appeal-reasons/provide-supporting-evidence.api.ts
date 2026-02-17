import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm, uploadDocument } from '../../../utils/citizen-user.utils';

export class ProvideSupportingEvidenceApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'case-building/provide-supporting-evidence',
    });

    const fileName = options.nameOfFileToUpload ?? 'Upload_Document_Test_1.txt';

    await uploadDocument({
      apiContext: this.apiContext,
      path: `case-building/reason-for-appeal/supporting-evidence/upload/file?_csrf=${csrfToken}`,
      fileUploadFieldName: 'file-upload',
      addtionalFields: {
        _csrf: csrfToken,
        uploadFile: '',
      },
      nameOfFileToUpload: fileName,
    });

    await postForm({
      apiContext: this.apiContext,
      path: 'case-building/reason-for-appeal/supporting-evidence/submit',
      form: {
        _csrf: csrfToken,
        saveAndContinue: '',
      },
    });
  }
}
