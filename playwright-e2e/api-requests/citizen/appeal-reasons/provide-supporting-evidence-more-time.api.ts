import { APIRequestContext } from '@playwright/test';
import { getCsrfToken, postForm, uploadDocument } from '../../../utils/citizen-user.utils';

export class ProvideSupportingEvidenceMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await getCsrfToken({
      apiContext: this.apiContext,
      path: 'provide-supporting-evidence-more-time',
    });

    const fileName = options.nameOfFileToUpload ?? 'Upload_Document_Test_1.txt';

    await uploadDocument({
      apiContext: this.apiContext,
      path: `provide-supporting-evidence-more-time?_csrf=${csrfToken}`,
      fileUploadFieldName: 'file-upload',
      addtionalFields: {
        _csrf: csrfToken,
        uploadFile: '',
      },
      nameOfFileToUpload: fileName,
    });

    await postForm({
      apiContext: this.apiContext,
      path: 'provide-supporting-evidence-more-time-submit',
      form: {
        _csrf: csrfToken,
      },
    });
  }
}
