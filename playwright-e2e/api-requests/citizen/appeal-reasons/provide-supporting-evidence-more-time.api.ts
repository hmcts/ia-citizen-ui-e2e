import { APIRequestContext } from '@playwright/test';
import { cui_getCsrfToken, cui_postForm, cui_uploadDocument } from '../../../utils/api-requests-utils';

export class ProvideSupportingEvidenceMoreTimeApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async submitForm(options: { nameOfFileToUpload?: string }): Promise<void> {
    const csrfToken = await cui_getCsrfToken({
      apiContext: this.apiContext,
      path: 'provide-supporting-evidence-more-time',
    });

    const fileName = options.nameOfFileToUpload ?? 'Provide_Supporting_Evidence_For_More_Time.txt';

    await cui_uploadDocument({
      apiContext: this.apiContext,
      path: `provide-supporting-evidence-more-time?_csrf=${csrfToken}`,
      fileUploadFieldName: 'file-upload',
      addtionalFields: {
        _csrf: csrfToken,
        uploadFile: '',
      },
      nameOfFileToUpload: fileName,
    });

    await cui_postForm({
      apiContext: this.apiContext,
      path: 'provide-supporting-evidence-more-time-submit',
      form: {
        _csrf: csrfToken,
      },
    });
  }
}
